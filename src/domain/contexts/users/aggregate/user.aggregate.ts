import { randomUUID } from 'crypto';
import { AggregateRoot } from 'src/domain/common/abstract/aggregate-root.abstract';

import { Authentication } from '../entities/authentication/user-authentication.entity';
import { Multifactor } from '../entities/multifactor/user-multifactor.entity';
import { MultifactorException } from '../entities/multifactor/exceptions/multifactor.exception';
import { UserInformation } from '../entities/information/user-information.entity';

import { ISecureLoginService } from '../interfaces/secure-login.interface';
import { IPasswordSecurityService } from '../interfaces/password-security.interface';

import { USER_EXCEPTION_FACTORY } from './exceptions/user-exception.factory';
import { UserStatus } from './configuration/status.configuration';
import { Status } from './value-objects/status.vo';

import { IVerificationUserService } from '../interfaces/verification-user.interface';
import { InitalizedUserVerificationEvent } from './events/verification/initialized-verification.event';
import { UserStatusChangedEvent } from './events/status/user-status-changed.event';
import {
  type UserAuthenticatedData,
  type UserCreatedProperties,
  type UserInformationParams,
  type UserParams,
  type MultifactorMethodParams,
} from '../types/user';
import { UserBlockedEvent } from './events/status/user-blocked.event';
import { UserUnblockedEvent } from './events/status/user-unblocked.event';
import { MultifactorInitializedEvent } from './events/auth/multifactor-initialized.event';
import { UserInvalidCredentialsEvent } from './events/auth/invalid-credentials.event';
import { UserAuthenticatedEvent } from './events/auth/user-authenticated.event';
import { IUserBlockerService } from '../interfaces/user-blocker.interface';

/**
 * Represents the User aggregate root in the domain layer.
 * Handles operations related to user authentication, multifactor authentication,
 * user information, and status.
 */
export class User extends AggregateRoot {
  /**
   * Private constructor to enforce factory method usage.
   *
   * @param userId - Unique identifier for the user.
   * @param _authentication - Authentication details.
   * @param _status - Initial status of the user.
   * @param _information - Personal information of the user.
   * @param _multifactorMethods - Multifactor register methods of the user.
   */
  private constructor(
    userId: string,
    private readonly _authentication: Authentication,
    private _status: Status,
    private readonly _information: UserInformation = UserInformation.initialize(),
    private readonly _multifactorMethods: Multifactor[] = [],
  ) {
    super(userId);
    this._authentication = _authentication;
    this._status = _status;
    this._information = _information;
    this._multifactorMethods = _multifactorMethods;
  }

  //#region Static Factory Methods

  /**
   * Creates a new user with the specified email and password.
   *
   * @param passwordService - Password security service for hashing
   * @param email - User's email.
   * @param password - User's password.
   * @returns A new User instance.
   */
  public static async create(
    passwordService: IPasswordSecurityService,
    email: string,
    password: string,
  ): Promise<User> {
    const user = new User(
      randomUUID(),
      Authentication.create(email, password),
      new Status(UserStatus.UNVERIFIED),
    );

    await user._authentication.securePassword(passwordService);

    return user;
  }

  /**
   * Builds a user instance from existing properties.
   *
   * @param params - User parameters including userId, authentication,
   *                 status, information, and multifactor methods.
   * @returns A new User instance constructed from the provided parameters.
   */
  public static build(params: UserParams): User {
    return new User(
      params.userId,
      params.authentication,
      new Status(params.status),
      params.information,
      params.multifactorMethods,
    );
  }

  //#endregion

  //#region Multifactor Operations

  /**
   * Adds a new multifactor authentication method for the user.
   *
   * @param method - Type of the multifactor method.
   * @param contact - Contact information for the multifactor method.
   */
  public addMultifactorMethod(method: string, contact: string): Multifactor {
    const newMethod = Multifactor.create(method, contact);
    if (this._multifactorMethods.length === 3) {
      throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_METHODS_EXCEEDED');
    }

    const multifactorRepeatedContact = this.getMultifactorMethodByParam(
      'contact',
      contact,
    );

    if (multifactorRepeatedContact) {
      throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_REPEATED_CONTACT');
    }

    this._multifactorMethods.push(newMethod);
    return newMethod;
  }

  /**
   * Retrieves a multifactor method by a specified parameter and its value.
   *
   * @param param - The parameter to search by (e.g., 'multifactorId', 'method').
   * @param value - The value to match against the parameter.
   * @returns The matching multifactor method or undefined.
   */
  private getMultifactorMethodByParam<K extends keyof MultifactorMethodParams>(
    param: K,
    value: MultifactorMethodParams[K],
  ): Multifactor | undefined {
    return this._multifactorMethods.find(
      (method) => method.params[param] === value,
    );
  }

  /**
   * Validates a multifactor authentication code against the user's active method.
   *
   * @param code - The code to validate.
   * @throws {UserException} If no active multifactor method is found or if validation fails.
   */
  public validateMultifactorCode(code: number): void {
    const multifactorActive = this.getMultifactorMethodByParam('active', true);

    if (!multifactorActive) {
      throw USER_EXCEPTION_FACTORY.new('NO_MULTIFACTOR_CODE_TO_VALIDATE');
    }

    multifactorActive.validate(code);
  }

  /**
   * Initializes multifactor authentication for the given method and throws an exception.
   *
   * @param multifactor - The multifactor method to initialize.
   */
  private initializeMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    this.triggerMultifactorInitializedEvent(multifactor);
    throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_AUTH_INITIALIZED');
  }

  /**
   * Retries multifactor authentication after failure and throws an exception.
   *
   * @param multifactor - The multifactor method to retry.
   */
  private retryMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    this.triggerMultifactorInitializedEvent(multifactor);
    throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_AUTH_REINITIALIZED');
  }

  /**
   * Handles exceptions related to multifactor authentication.
   *
   * @param multifactor - The multifactor method that caused the exception.
   * @param error - The exception thrown.
   * @throws Re-throws the error if not a MultifactorException or if not handled.
   */
  private handleMultifactorException(
    multifactor: Multifactor,
    error: unknown,
  ): void {
    if (error instanceof MultifactorException) {
      if (error.matchesErrorKey('ALREADY_AUTHENTICATED')) return;
      if (error.matchesErrorKey('EXPIRED_CODE'))
        this.retryMultifactorAuthentication(multifactor);
    }
    throw error;
  }

  //#endregion

  //#region Update Authentication Operations

  /**
   * Updates the user's email or password.
   *
   * @param email - New email for the user (optional).
   * @param password - New password for the user (optional).
   * @throws {UserException} If neither email nor password is provided.
   */
  public updateAuthentication(email?: string, password?: string): void {
    if (!email && !password) {
      throw USER_EXCEPTION_FACTORY.new('AT_LEAST_ONE_AUTH_PROPERTY_REQUIRED');
    }
    if (email) this._authentication.updateEmail(email);
    if (password) this._authentication.updatePassword(password);
  }

  // Information Operations

  /**
   * Updates the user's personal information.
   *
   * @param information - New user information.
   */
  public updateUserInformation(information: UserInformationParams): void {
    this._information.update(information);
  }

  //#endregion

  //#region Status Management

  /**
   * Verify the user's account.
   */
  public verify(): void {
    this._status = new Status(UserStatus.VERIFIED);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Deactivates the user's account.
   */
  public deactivate(): void {
    this._status = new Status(UserStatus.INACTIVE);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Marks the user's account as deleted.
   */
  public delete(): void {
    this._status = new Status(UserStatus.DELETED);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Blocks the user's account and throws an exception.
   * @throws {UserException} With 'USER_BLOCKED' message
   */
  public block(): void {
    this._status = new Status(UserStatus.BLOCKED);
    this.triggerUserStatusChangedEvent();
    this.triggerUserBlockedEvent();
    throw USER_EXCEPTION_FACTORY.new('USER_BLOCKED');
  }

  /**
   * Unblocks the user's account.
   */
  public unblock(): void {
    this._status = new Status(UserStatus.VERIFIED);
    this.triggerUserStatusChangedEvent();
    this.triggerUserUnblockedEvent();
  }

  /**
   * Checks if the user's current status matches the specified status.
   *
   * @param status - The status to check against.
   * @returns True if the user's status matches; otherwise, false.
   */
  private isStatus(status: UserStatus): boolean {
    return this._status.value === status.toLowerCase();
  }

  //#endregion

  //#region Verification User Operations

  /**
   * Requests user verification by generating and saving a verification code.
   *
   * @param verificationUserService - Service to handle verification operations.
   * @throws {UserException} If user is already verified or verification is in progress.
   */
  public async requestVerification(
    verificationUserService: IVerificationUserService,
  ): Promise<void> {
    this.checkUserVerifiedStatus();
    await this.checkUserVerificationInProgress(verificationUserService);
    this.triggerInitializedUserVerificationEvent();
  }

  /**
   * Verifies the user account using the provided code.
   *
   * @param verificationUserService - Service to handle verification operations.
   * @param code - Verification code to validate.
   * @throws {UserException} If verification fails for any reason.
   */
  public async verifyUser(
    verificationUserService: IVerificationUserService,
    code: string,
  ): Promise<void> {
    this.checkUserVerifiedStatus();
    await this.checkVerificationCode(verificationUserService, code);
    this.verify();
  }

  /**
   * Checks if user is already verified.
   * @throws {UserException} If user is already verified.
   */
  private checkUserVerifiedStatus(): void {
    if (this.isStatus(UserStatus.VERIFIED))
      throw USER_EXCEPTION_FACTORY.new('USER_ALREADY_VERIFIED');
  }

  /**
   * Checks if there's an existing verification in progress.
   *
   * @param verificationUserService - Service to check verification status.
   * @throws {UserException} If verification is already in progress.
   */
  private async checkUserVerificationInProgress(
    verificationUserService: IVerificationUserService,
  ): Promise<void> {
    const inProgress = await verificationUserService.isVerificationInProgress(
      this.id,
    );

    if (!inProgress) return;

    throw USER_EXCEPTION_FACTORY.new('VERIFICATION_USER_IN_PROGRESS');
  }

  /**
   * Validates the verification code against stored data.
   *
   * @param verificationUserService - Service to retrieve verification data.
   * @param code - Code to validate.
   * @throws {UserException} If code is invalid, expired, or not requested.
   */
  private async checkVerificationCode(
    verificationUserService: IVerificationUserService,
    code: string,
  ): Promise<void> {
    const inProgress = await verificationUserService.isVerificationInProgress(
      this.id,
    );

    if (!inProgress) {
      throw USER_EXCEPTION_FACTORY.new('VERIFICATION_USER_NOT_REQUESTED');
    }

    const isValid = await verificationUserService.validateVerificationCode(
      this.id,
      code,
    );

    if (!isValid) {
      throw USER_EXCEPTION_FACTORY.new('INVALID_VERIFICATION_USER_CODE');
    }
  }

  //#endregion

  //#region Authentication Operations

  /**
   * Attempts to log in the user, validating credentials and managing login attempts.
   *
   * @param secureLoginService - Service to manage login attempts.
   * @param passwordService - Service to validate the password.
   * @param password - Password provided by the user.
   * @throws {UserException} If login fails for any reason.
   */
  public async authenticate(
    secureLoginService: ISecureLoginService,
    passwordService: IPasswordSecurityService,
    userBlockerService: IUserBlockerService,
    password: string,
  ): Promise<UserAuthenticatedData> {
    this.checkUserExists();
    await this.checkUserBlocked(userBlockerService);
    await this.checkLoginAttemptLimit(secureLoginService);
    await this.validateCredentials(passwordService, password);
    this.checkMultifactorAuthentication();
    this.triggerUserAuthenticatedEvent();
    return this.userAuthenticatedData;
  }

  /**
   * Validates the user's password and records failed attempts if incorrect.
   *
   * @param secureLoginService - Service to manage login attempts.
   * @param passwordService - Service to validate the password.
   * @param password - Password provided by the user.
   * @throws {UserException} If credentials are invalid.
   */
  private async validateCredentials(
    passwordService: IPasswordSecurityService,
    password: string,
  ): Promise<void> {
    const isPasswordCorrect = await this._authentication.checkCredentials(
      password,
      passwordService,
    );

    if (!isPasswordCorrect) {
      this.triggerUserInvalidCredentialsEvent();
      throw USER_EXCEPTION_FACTORY.throwValidation('INVALID_CREDENTIALS');
    }
  }

  /**
   * Checks for active multifactor authentication and handles it accordingly.
   * @throws {UserException} If multifactor authentication is required.
   */
  private checkMultifactorAuthentication(): void {
    const activeMethod = this.getMultifactorMethodByParam('active', true);
    if (!activeMethod) return;
    try {
      this.initializeMultifactorAuthentication(activeMethod);
    } catch (error) {
      this.handleMultifactorException(activeMethod, error);
    }
  }

  /**
   * Checks if the user has exceeded the login attempt limit and blocks the account if necessary.
   *
   * @param secureLoginService - Service to manage login attempts.
   */
  private async checkLoginAttemptLimit(
    secureLoginService: ISecureLoginService,
  ): Promise<void> {
    const hasExceededLimit = await secureLoginService.hasExceededAttemptLimit(
      this.id,
    );

    if (hasExceededLimit) {
      this.block();
    }
  }

  /**
   * Checks if the user is temporarily blocked and unblocks if the block period has expired.
   *
   * @param secureLoginService - Service to manage login attempts.
   */
  private async checkUserBlocked(
    userBlockerService: IUserBlockerService,
  ): Promise<void> {
    const isBlocked = this.isStatus(UserStatus.BLOCKED);
    const isStillBlocked = await userBlockerService.isTemporarilyBlockedYet(
      this.id,
    );

    if (isBlocked && !isStillBlocked) {
      this.unblock();
      return;
    }

    if (isBlocked) {
      throw USER_EXCEPTION_FACTORY.new('USER_BLOCKED');
    }
  }

  /**
   * Validates if the user's status is deleted.
   * @throws {UserException} If user is deleted.
   */
  private checkUserExists() {
    if (this.isStatus(UserStatus.DELETED)) {
      throw USER_EXCEPTION_FACTORY.throwValidation('USER_DELETED');
    }
  }

  //#endregion

  //#region Events

  /**
   * Triggers an event when multifactor authentication is initialized.
   * @param multifactor - The multifactor method being initialized.
   */
  private triggerMultifactorInitializedEvent(multifactor: Multifactor): void {
    this.addEvent(new MultifactorInitializedEvent(this.id, multifactor));
  }

  /**
   * Triggers an event when user verification is initialized.
   * @param code - The verification code being sent.
   */
  private triggerInitializedUserVerificationEvent(): void {
    this.addEvent(
      new InitalizedUserVerificationEvent(this.id, this._authentication.email),
    );
  }

  /*
   * Triggers an event when user status has changed.
   */
  private triggerUserStatusChangedEvent() {
    this.addEvent(new UserStatusChangedEvent(this.id, this.status));
  }

  /**
   * Triggers an event when user is blocked.
   */
  private triggerUserBlockedEvent() {
    this.addEvent(new UserBlockedEvent(this.id));
  }

  /**
   * Triggers an event when user is unblocked.
   */
  private triggerUserUnblockedEvent() {
    this.addEvent(new UserUnblockedEvent(this.id));
  }

  /**
   * Triggers an event when user pass invalid credentials.
   */
  private triggerUserInvalidCredentialsEvent() {
    this.addEvent(new UserInvalidCredentialsEvent(this.id));
  }

  /**
   * Triggers an event when user is authenticated.
   */
  private triggerUserAuthenticatedEvent() {
    this.addEvent(new UserAuthenticatedEvent(this.id));
  }

  //#endregion

  //#region Getters

  /**
   * Gets the user's email address.
   * @returns The user's email.
   */
  get email(): string {
    return this._authentication.email;
  }

  /**
   * Gets the user's current status.
   * @returns The current status value.
   */
  get status(): string {
    return this._status.value;
  }

  /**
   * Gets the initial creation properties of the user.
   * @returns Object containing userId, email, password, and status.
   */
  get createdState(): UserCreatedProperties {
    return {
      userId: this.id,
      email: this.email,
      password: this._authentication.password,
      status: this._status.value,
    };
  }

  private get userAuthenticatedData(): UserAuthenticatedData {
    return {
      userId: this.id,
      email: this.email,
      fullName: this._information.fullName,
      status: this.status,
    };
  }
}
