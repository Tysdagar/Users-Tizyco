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

import { type UserInformationParams } from '../types/user';
import { MultifactorInitializedEvent } from './events/multifactor-initialized.event';

/**
 * Represents the User aggregate root in the domain layer.
 * Handles operations related to user authentication, multifactor authentication, user information, and status.
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

  // Static Factory Methods

  /**
   * Creates a new user with the specified email and password.
   *
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

    await passwordService.secure(user._authentication.password);

    return user;
  }

  // Multifactor Operations

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

  public validateMultifactorCode(code: number) {
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
    USER_EXCEPTION_FACTORY.throw('MULTIFACTOR_AUTH_INITIALIZED');
    this.triggerMultifactorInitializedEvent(multifactor);
  }

  /**
   * Retries multifactor authentication after failure and throws an exception.
   *
   * @param multifactor - The multifactor method to retry.
   */
  private retryMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    USER_EXCEPTION_FACTORY.throw('MULTIFACTOR_AUTH_REINITIALIZED');
    this.triggerMultifactorInitializedEvent(multifactor);
  }

  /**
   * Handles exceptions related to multifactor authentication.
   *
   * @param multifactor - The multifactor method that caused the exception.
   * @param error - The exception thrown.
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

  // Authentication Operations

  /**
   * Updates the user's email or password.
   *
   * @param email - New email for the user (optional).
   * @param password - New password for the user (optional).
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

  // Status Management

  /**
   * Marks the user as verified.
   */
  public verify(): void {
    if (this.isStatus(UserStatus.VERIFIED))
      USER_EXCEPTION_FACTORY.throw('USER_ALREADY_VERIFIED');
    this._status = new Status(UserStatus.VERIFIED);
  }

  /**
   * Activates the user's account.
   */
  public activate(): void {
    this._status = new Status(UserStatus.VERIFIED);
  }

  /**
   * Deactivates the user's account.
   */
  public deactivate(): void {
    this._status = new Status(UserStatus.INACTIVE);
  }

  /**
   * Marks the user's account as deleted.
   */
  public delete(): void {
    this._status = new Status(UserStatus.DELETED);
  }

  /**
   * Blocks the user's account and throws an exception.
   */
  public block(): void {
    this._status = new Status(UserStatus.BLOCKED);
    USER_EXCEPTION_FACTORY.throw('USER_BLOCKED');
  }

  /**
   * Unblocks the user's account.
   */
  public unblock(): void {
    this._status = new Status(UserStatus.VERIFIED);
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

  // Login Operations

  /**
   * Attempts to log in the user, validating credentials and managing login attempts.
   *
   * @param loginAttemptService - Service to manage login attempts.
   * @param passwordService - Service to validate the password.
   * @param password - Password provided by the user.
   */
  public async tryLogin(
    loginAttemptService: ILoginAttemptService,
    passwordService: IPasswordSecurityService,
    password: string,
  ): Promise<void> {
    await this.checkTemporaryBlockStatus(loginAttemptService);
    await this.validateCredentials(
      loginAttemptService,
      passwordService,
      password,
    );
    this.checkMultifactorAuthentication();
    await this.checkLoginAttemptLimit(loginAttemptService);
    await loginAttemptService.resetAttempts(this.id);
  }

  /**
   * Validates the user's password and records failed attempts if incorrect.
   *
   * @param loginAttemptService - Service to manage login attempts.
   * @param passwordService - Service to validate the password.
   * @param password - Password provided by the user.
   */
  private async validateCredentials(
    loginAttemptService: ILoginAttemptService,
    passwordService: IPasswordSecurityService,
    password: string,
  ): Promise<void> {
    const isPasswordCorrect = await passwordService.check(
      password,
      this._authentication.password,
    );
    if (isPasswordCorrect) {
      this.checkValidUserStatus();
    } else {
      await loginAttemptService.recordFailedAttempt(this.id);
      USER_EXCEPTION_FACTORY.throwValidation('INVALID_CREDENTIALS');
    }
  }

  /**
   * Checks for active multifactor authentication and handles it accordingly.
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
    }
  }

  /**
   * Checks if the user is temporarily blocked and unblocks if the block period has expired.
   *
   * @param loginAttemptService - Service to manage login attempts.
   */
  private async checkTemporaryBlockStatus(
    loginAttemptService: ILoginAttemptService,
  ): Promise<void> {
    const isBlocked = this.isStatus(UserStatus.BLOCKED);
    const isStillBlocked = await loginAttemptService.isTemporalyBlockedYet(
      this.id,
    );
    if (isBlocked && !isStillBlocked) {
      this.unblock();
      await loginAttemptService.resetAttempts(this.id);
    }
  }

  /**
   * Validates if the user's status allows login.
   */
  private checkValidUserStatus(): void {
    if (this.isStatus(UserStatus.BLOCKED)) {
      USER_EXCEPTION_FACTORY.throw('USER_BLOCKED');
    }
    if (this.isStatus(UserStatus.DELETED)) {
      USER_EXCEPTION_FACTORY.throwValidation('USER_DELETED');
    }
  }

  // Events

  private triggerMultifactorInitializedEvent(multifactor: Multifactor) {
    this.addEvent(new MultifactorInitializedEvent(this.id, multifactor));
  }
}
