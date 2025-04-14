import { randomUUID } from 'crypto';
import { AggregateRoot } from 'src/domain/common/abstract/aggregate-root.abstract';

import { Authentication } from '../entities/authentication/user-authentication.entity';
import { Multifactor } from '../entities/multifactor/user-multifactor.entity';
import { MultifactorException } from '../entities/multifactor/exceptions/multifactor.exception';
import { UserInformation } from '../entities/information/user-information.entity';

import { ILoginAttemptService } from '../interfaces/login-attempts.interface';
import { IPasswordSecurityService } from '../interfaces/password-security.interface';

import { USER_EXCEPTION_FACTORY } from './exceptions/user-exception.factory';
import { UserStatus } from './configuration/status.configuration';
import { Status } from './value-objects/status.vo';

import { MultifactorInitializedEvent } from './events/multifactor-initialized.event';
import { IVerificationUserService } from '../interfaces/verification-account.interface';
import { InitalizedUserVerificationEvent } from './events/requested-verification.event';
import { VerificationCodeGenerator } from './configuration/verification-code.configuration';
import { UserStatusChangedEvent } from './events/user-status-changed.event';
import {
  type UserAuthenticatedData,
  type UserCreatedProperties,
  type UserInformationParams,
  type UserParams,
} from '../types/user';

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
  public addMultifactorMethod(method: string, contact: string): void {
    const newMethod = Multifactor.create(method, contact);
    this._multifactorMethods.push(newMethod);
  }

  /**
   * Retrieves the currently active multifactor method, if any.
   *
   * @returns The active multifactor method or undefined.
   */
  private getActiveMultifactorMethod(): Multifactor | undefined {
    return this._multifactorMethods.find((method) => method.isActive);
  }

  /**
   * Validates a multifactor authentication code against the user's active method.
   *
   * @param code - The code to validate.
   * @throws {UserException} If no active multifactor method is found or if validation fails.
   */
  public validateMultifactorCode(code: number): void {
    const multifactor = this.getActiveMultifactorMethod();

    if (!multifactor) {
      throw USER_EXCEPTION_FACTORY.throw('NO_MULTIFACTOR_CODE_TO_VALIDATE');
    }

    multifactor.validate(code);
  }

  /**
   * Initializes multifactor authentication for the given method and throws an exception.
   *
   * @param multifactor - The multifactor method to initialize.
   */
  private initializeMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    this.triggerMultifactorInitializedEvent(multifactor);
    USER_EXCEPTION_FACTORY.throw('MULTIFACTOR_AUTH_INITIALIZED');
  }

  /**
   * Retries multifactor authentication after failure and throws an exception.
   *
   * @param multifactor - The multifactor method to retry.
   */
  private retryMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    this.triggerMultifactorInitializedEvent(multifactor);
    USER_EXCEPTION_FACTORY.throw('MULTIFACTOR_AUTH_REINITIALIZED');
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
      USER_EXCEPTION_FACTORY.throw('AT_LEAST_ONE_AUTH_PROPERTY_REQUIRED');
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
   * Activates the user's account.
   */
  public activate(): void {
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
  }

  /**
   * Unblocks the user's account.
   */
  public unblock(): void {
    this._status = new Status(UserStatus.VERIFIED);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Checks if the user's current status matches the specified status.
   *
   * @param status - The status to check against.
   * @returns True if the user's status matches; otherwise, false.
   */
  private isStatus(status: UserStatus): boolean {
    return this._status.value === (status as string);
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
    const payload = VerificationCodeGenerator.generate(this.id);
    await verificationUserService.saveVerificationCodeData(payload);
    this.triggerInitializedUserVerificationEvent(payload.code);
  }

  /**
   * Verifies the user account using the provided code.
   *
   * @param verificationUserService - Service to handle verification operations.
   * @param code - Verification code to validate.
   * @throws {UserException} If verification fails for any reason.
   */
  public async verify(
    verificationUserService: IVerificationUserService,
    code: string,
  ): Promise<void> {
    this.checkUserVerifiedStatus();
    await this.checkVerificationCode(verificationUserService, code);
    this.activate();
  }

  /**
   * Checks if user is already verified.
   * @throws {UserException} If user is already verified.
   */
  private checkUserVerifiedStatus(): void {
    if (this.isStatus(UserStatus.VERIFIED))
      USER_EXCEPTION_FACTORY.throw('USER_ALREADY_VERIFIED');
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
    const code = await verificationUserService.getVerificationCodeData(this.id);

    if (code) {
      if (VerificationCodeGenerator.checkIsExpired(code.expiresDate)) {
        await verificationUserService.removeVerificationCodeData(this.id);
        return;
      }

      throw USER_EXCEPTION_FACTORY.throw('VERIFICATION_USER_IN_PROGRESS');
    }
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
    const verificationCode =
      await verificationUserService.getVerificationCodeData(this.id);

    if (!verificationCode) {
      throw USER_EXCEPTION_FACTORY.throw('VERIFICATION_USER_NOT_REQUESTED');
    }

    if (
      VerificationCodeGenerator.checkIsExpired(verificationCode.expiresDate)
    ) {
      throw USER_EXCEPTION_FACTORY.throw('VERIFICATION_USER_CODE_EXPIRED');
    }

    if (code !== verificationCode.code) {
      await verificationUserService.removeVerificationCodeData(this.id);
      throw USER_EXCEPTION_FACTORY.throw('INVALID_VERIFICATION_USER_CODE');
    }
  }

  //#endregion

  //#region Authentication Operations

  /**
   * Attempts to log in the user, validating credentials and managing login attempts.
   *
   * @param loginAttemptService - Service to manage login attempts.
   * @param passwordService - Service to validate the password.
   * @param password - Password provided by the user.
   * @throws {UserException} If login fails for any reason.
   */
  public async authenticate(
    loginAttemptService: ILoginAttemptService,
    passwordService: IPasswordSecurityService,
    password: string,
  ): Promise<UserAuthenticatedData> {
    this.checkUserExists();
    await this.checkUserBlocked(loginAttemptService);
    await this.validateCredentials(
      loginAttemptService,
      passwordService,
      password,
    );
    this.checkMultifactorAuthentication();
    await loginAttemptService.resetAttempts(this.id);
    return this.userAuthenticatedData;
  }

  /**
   * Validates the user's password and records failed attempts if incorrect.
   *
   * @param loginAttemptService - Service to manage login attempts.
   * @param passwordService - Service to validate the password.
   * @param password - Password provided by the user.
   * @throws {UserException} If credentials are invalid.
   */
  private async validateCredentials(
    loginAttemptService: ILoginAttemptService,
    passwordService: IPasswordSecurityService,
    password: string,
  ): Promise<void> {
    const isPasswordCorrect = await this._authentication.checkCredentials(
      password,
      passwordService,
    );

    if (!isPasswordCorrect) {
      await this.checkLoginAttemptLimit(loginAttemptService);
      await loginAttemptService.recordFailedAttempt(this.id);
      USER_EXCEPTION_FACTORY.throwValidation('INVALID_CREDENTIALS');
    }
  }

  /**
   * Checks for active multifactor authentication and handles it accordingly.
   * @throws {UserException} If multifactor authentication is required.
   */
  private checkMultifactorAuthentication(): void {
    const activeMethod = this.getActiveMultifactorMethod();
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
   * @param loginAttemptService - Service to manage login attempts.
   */
  private async checkLoginAttemptLimit(
    loginAttemptService: ILoginAttemptService,
  ): Promise<void> {
    const hasExceededLimit = await loginAttemptService.hasExceededAttemptLimit(
      this.id,
    );

    if (hasExceededLimit) {
      this.block();
      await loginAttemptService.blockUserTemporarily(this.id);
      USER_EXCEPTION_FACTORY.throw('USER_BLOCKED');
    }
  }

  /**
   * Checks if the user is temporarily blocked and unblocks if the block period has expired.
   *
   * @param loginAttemptService - Service to manage login attempts.
   */
  private async checkUserBlocked(
    loginAttemptService: ILoginAttemptService,
  ): Promise<void> {
    const isBlocked = this.isStatus(UserStatus.BLOCKED);
    const isStillBlocked = await loginAttemptService.isTemporarilyBlockedYet(
      this.id,
    );

    if (isBlocked && !isStillBlocked) {
      this.unblock();
      await loginAttemptService.resetAttempts(this.id);
      return;
    }

    if (isBlocked) {
      USER_EXCEPTION_FACTORY.throwValidation('USER_BLOCKED');
    }
  }

  /**
   * Validates if the user's status is deleted.
   * @throws {UserException} If user is deleted.
   */
  private checkUserExists() {
    if (this.isStatus(UserStatus.DELETED)) {
      USER_EXCEPTION_FACTORY.throwValidation('USER_DELETED');
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
  private triggerInitializedUserVerificationEvent(code: string): void {
    this.addEvent(new InitalizedUserVerificationEvent(this.id, code));
  }

  /**
   * Triggers an event when user status has changed.
   */
  private triggerUserStatusChangedEvent() {
    this.addEvent(new UserStatusChangedEvent(this.id, this.status));
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
