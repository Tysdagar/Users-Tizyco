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
 * Core user management aggregate root implementing business rules for:
 * - User lifecycle (creation, verification, blocking)
 * - Authentication and credential management
 * - Multifactor authentication setup
 * - Status transitions with event emission
 *
 * @class User
 * @extends AggregateRoot
 *
 * @property {string} email - User's email address (readonly)
 * @property {string} status - Current user status (readonly)
 * @property {UserCreatedProperties} createdState - Initial creation properties
 */
export class User extends AggregateRoot {
  /**
   * Private constructor to enforce factory method usage.
   * @param {string} userId - Unique identifier for the user
   * @param {Authentication} _authentication - Authentication details
   * @param {Status} _status - Current user status
   * @param {UserInformation} [_information=UserInformation.initialize()] - Personal information
   * @param {Multifactor[]} [_multifactorMethods=[]] - Registered MFA methods
   */
  private constructor(
    userId: string,
    private readonly _authentication: Authentication,
    private _status: Status,
    private readonly _information: UserInformation = UserInformation.initialize(),
    private readonly _multifactorMethods: Multifactor[] = [],
  ) {
    super(userId);
  }

  //#region Static Factory Methods

  /**
   * Creates a new user with the specified email and password.
   * @async
   * @static
   * @param {IPasswordSecurityService} passwordService - Password hashing service
   * @param {string} email - User's email address
   * @param {string} password - User's plain text password
   * @returns {Promise<User>} Newly created User instance
   * @throws {UserException} If email or password validation fails
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
   * @static
   * @param {UserParams} params - User construction parameters
   * @returns {User} Reconstructed User instance
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
   * @param {string} method - Type of MFA method (SMS, EMAIL, etc.)
   * @param {string} contact - Contact information for the method
   * @returns {Multifactor} The created multifactor method
   * @throws {UserException} When:
   * - Maximum MFA methods (3) reached (MULTIFACTOR_METHODS_EXCEEDED)
   * - Contact already registered (MULTIFACTOR_REPEATED_CONTACT)
   */
  public addMultifactorMethod(method: string, contact: string): Multifactor {
    if (this._multifactorMethods.length === 3) {
      throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_METHODS_EXCEEDED');
    }

    if (this.getMultifactorMethodByParam('contact', contact)) {
      throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_REPEATED_CONTACT');
    }

    const newMethod = Multifactor.create(method, contact);

    return newMethod;
  }

  /**
   * Validates a multifactor authentication code.
   * @param {number} code - The code to validate
   * @throws {UserException} When:
   * - No active MFA method (NO_MULTIFACTOR_CODE_TO_VALIDATE)
   * - Code validation fails (handled by Multifactor entity)
   */
  public validateMultifactorCode(code: number): void {
    const method = this.getMultifactorMethodByParam('active', true);
    if (!method)
      throw USER_EXCEPTION_FACTORY.new('NO_MULTIFACTOR_CODE_TO_VALIDATE');
    method.validate(code);
  }

  /**
   * Retrieves a multifactor method by parameter.
   * @private
   * @template K - Key of MultifactorMethodParams
   * @param {K} param - Parameter to search by
   * @param {MultifactorMethodParams[K]} value - Value to match
   * @returns {Multifactor|undefined} Found method or undefined
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
   * Initializes multifactor authentication process.
   * @private
   * @param {Multifactor} multifactor - MFA method to initialize
   * @throws {UserException} MULTIFACTOR_AUTH_INITIALIZED
   * @emits MultifactorInitializedEvent
   */
  private initializeMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    this.triggerMultifactorInitializedEvent(multifactor);
    throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_AUTH_INITIALIZED');
  }

  /**
   * Retries multifactor authentication after failure.
   * @private
   * @param {Multifactor} multifactor - MFA method to retry
   * @throws {UserException} MULTIFACTOR_AUTH_REINITIALIZED
   * @emits MultifactorInitializedEvent
   */
  private retryMultifactorAuthentication(multifactor: Multifactor): void {
    multifactor.initialize();
    this.triggerMultifactorInitializedEvent(multifactor);
    throw USER_EXCEPTION_FACTORY.new('MULTIFACTOR_AUTH_REINITIALIZED');
  }

  /**
   * Handles multifactor authentication exceptions.
   * @private
   * @param {Multifactor} multifactor - MFA method that caused exception
   * @param {unknown} error - Thrown exception
   * @throws Re-throws unhandled exceptions
   */
  private handleMultifactorException(
    multifactor: Multifactor,
    error: unknown,
  ): void {
    if (error instanceof MultifactorException) {
      if (error.matchesErrorKey('ALREADY_AUTHENTICATED')) return;
      if (error.matchesErrorKey('EXPIRED_CODE')) {
        this.retryMultifactorAuthentication(multifactor);
      }
    }
    throw error;
  }

  //#endregion

  //#region Status Management

  /**
   * Verifies the user's account.
   * @emits UserStatusChangedEvent
   */
  public verify(): void {
    this._status = new Status(UserStatus.VERIFIED);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Deactivates the user's account.
   * @emits UserStatusChangedEvent
   */
  public deactivate(): void {
    this._status = new Status(UserStatus.INACTIVE);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Marks the user's account as deleted.
   * @emits UserStatusChangedEvent
   */
  public delete(): void {
    this._status = new Status(UserStatus.DELETED);
    this.triggerUserStatusChangedEvent();
  }

  /**
   * Blocks the user's account.
   * @emits UserBlockedEvent
   * @emits UserStatusChangedEvent
   * @throws {UserException} USER_BLOCKED
   */
  public block(): void {
    this._status = new Status(UserStatus.BLOCKED);
    this.triggerUserStatusChangedEvent();
    this.triggerUserBlockedEvent();
    throw USER_EXCEPTION_FACTORY.new('USER_BLOCKED');
  }

  /**
   * Unblocks the user's account.
   * @emits UserUnblockedEvent
   * @emits UserStatusChangedEvent
   */
  public unblock(): void {
    this._status = new Status(UserStatus.VERIFIED);
    this.triggerUserStatusChangedEvent();
    this.triggerUserUnblockedEvent();
  }

  /**
   * Checks if user matches specified status.
   * @private
   * @param {UserStatus} status - Status to check against
   * @returns {boolean} True if status matches
   */
  private isStatus(status: UserStatus): boolean {
    return this._status.value === status.toLowerCase();
  }

  //#endregion

  //#region Authentication Operations

  /**
   * Authenticates the user with provided credentials.
   * @async
   * @param {ISecureLoginService} secureLoginService - Login attempt service
   * @param {IPasswordSecurityService} passwordService - Password validation service
   * @param {IUserBlockerService} userBlockerService - User blocking service
   * @param {string} password - Plain text password
   * @returns {Promise<UserAuthenticatedData>} User authentication data
   * @throws {UserException} When:
   * - User is blocked/deleted
   * - Invalid credentials
   * - MFA required (MULTIFACTOR_AUTH_INITIALIZED)
   * @emits UserAuthenticatedEvent on success
   * @emits UserInvalidCredentialsEvent on failure
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
   * Updates the user's email or password.
   * @param {string} [email] - New email
   * @param {string} [password] - New password
   * @throws {UserException} AT_LEAST_ONE_AUTH_PROPERTY_REQUIRED
   */
  public updateAuthentication(email?: string, password?: string): void {
    if (!email && !password) {
      throw USER_EXCEPTION_FACTORY.new('AT_LEAST_ONE_AUTH_PROPERTY_REQUIRED');
    }
    if (email) this._authentication.updateEmail(email);
    if (password) this._authentication.updatePassword(password);
  }

  /**
   * Updates the user's personal information.
   * @param {UserInformationParams} information - New information
   */
  public updateUserInformation(information: UserInformationParams): void {
    this._information.update(information);
  }

  /**
   * Validates user credentials.
   * @private
   * @async
   * @param {IPasswordSecurityService} passwordService - Password service
   * @param {string} password - Plain text password
   * @throws {UserException} INVALID_CREDENTIALS
   * @emits UserInvalidCredentialsEvent on failure
   */
  private async validateCredentials(
    passwordService: IPasswordSecurityService,
    password: string,
  ): Promise<void> {
    const isValid = await this._authentication.checkCredentials(
      password,
      passwordService,
    );
    if (!isValid) {
      this.triggerUserInvalidCredentialsEvent();
      throw USER_EXCEPTION_FACTORY.throwValidation('INVALID_CREDENTIALS');
    }
  }

  /**
   * Checks for active MFA requirements.
   * @private
   * @throws {UserException} MULTIFACTOR_AUTH_INITIALIZED
   */
  private checkMultifactorAuthentication(): void {
    const method = this.getMultifactorMethodByParam('active', true);
    if (!method) return;
    try {
      this.initializeMultifactorAuthentication(method);
    } catch (error) {
      this.handleMultifactorException(method, error);
    }
  }

  /**
   * Checks login attempt limits.
   * @private
   * @async
   * @param {ISecureLoginService} secureLoginService - Login service
   */
  private async checkLoginAttemptLimit(
    secureLoginService: ISecureLoginService,
  ): Promise<void> {
    if (await secureLoginService.hasExceededAttemptLimit(this.id)) {
      this.block();
    }
  }

  /**
   * Checks if user is blocked.
   * @private
   * @async
   * @param {IUserBlockerService} userBlockerService - Blocker service
   * @throws {UserException} USER_BLOCKED
   */
  private async checkUserBlocked(
    userBlockerService: IUserBlockerService,
  ): Promise<void> {
    if (!this.isStatus(UserStatus.BLOCKED)) return;

    if (!(await userBlockerService.isTemporarilyBlockedYet(this.id))) {
      this.unblock();
      return;
    }
    throw USER_EXCEPTION_FACTORY.new('USER_BLOCKED');
  }

  /**
   * Verifies user exists (not deleted).
   * @private
   * @throws {UserException} USER_DELETED
   */
  private checkUserExists(): void {
    if (this.isStatus(UserStatus.DELETED)) {
      throw USER_EXCEPTION_FACTORY.throwValidation('USER_DELETED');
    }
  }

  //#endregion

  //#region Verification Operations

  /**
   * Requests user verification.
   * @async
   * @param {IVerificationUserService} verificationUserService - Verification service
   * @throws {UserException} When:
   * - User already verified (USER_ALREADY_VERIFIED)
   * - Verification in progress (VERIFICATION_USER_IN_PROGRESS)
   * @emits InitalizedUserVerificationEvent
   */
  public async requestVerification(
    verificationUserService: IVerificationUserService,
  ): Promise<void> {
    this.checkUserVerifiedStatus();
    if (await verificationUserService.isVerificationInProgress(this.id)) {
      throw USER_EXCEPTION_FACTORY.new('VERIFICATION_USER_IN_PROGRESS');
    }
    this.triggerInitializedUserVerificationEvent();
  }

  /**
   * Verifies user account with code.
   * @async
   * @param {IVerificationUserService} verificationUserService - Verification service
   * @param {string} code - Verification code
   * @throws {UserException} When:
   * - User already verified (USER_ALREADY_VERIFIED)
   * - Invalid/expired code (INVALID_VERIFICATION_USER_CODE)
   * - No verification requested (VERIFICATION_USER_NOT_REQUESTED)
   */
  public async verifyUser(
    verificationUserService: IVerificationUserService,
    code: string,
  ): Promise<void> {
    this.checkUserVerifiedStatus();
    if (
      !(await verificationUserService.validateVerificationCode(this.id, code))
    ) {
      throw USER_EXCEPTION_FACTORY.new('INVALID_VERIFICATION_USER_CODE');
    }
    this.verify();
  }

  /**
   * Checks if user is verified.
   * @private
   * @throws {UserException} USER_ALREADY_VERIFIED
   */
  private checkUserVerifiedStatus(): void {
    if (this.isStatus(UserStatus.VERIFIED)) {
      throw USER_EXCEPTION_FACTORY.new('USER_ALREADY_VERIFIED');
    }
  }

  //#endregion

  //#region Events

  /**
   * Triggers multifactor initialized event.
   * @private
   * @param {Multifactor} multifactor - MFA method
   */
  private triggerMultifactorInitializedEvent(multifactor: Multifactor): void {
    this.addEvent(new MultifactorInitializedEvent(this.id, multifactor));
  }

  /**
   * Triggers verification initialized event.
   * @private
   */
  private triggerInitializedUserVerificationEvent(): void {
    this.addEvent(new InitalizedUserVerificationEvent(this.id, this.email));
  }

  /**
   * Triggers status changed event.
   * @private
   */
  private triggerUserStatusChangedEvent(): void {
    this.addEvent(new UserStatusChangedEvent(this.id, this.status));
  }

  /**
   * Triggers user blocked event.
   * @private
   */
  private triggerUserBlockedEvent(): void {
    this.addEvent(new UserBlockedEvent(this.id));
  }

  /**
   * Triggers user unblocked event.
   * @private
   */
  private triggerUserUnblockedEvent(): void {
    this.addEvent(new UserUnblockedEvent(this.id));
  }

  /**
   * Triggers invalid credentials event.
   * @private
   */
  private triggerUserInvalidCredentialsEvent(): void {
    this.addEvent(new UserInvalidCredentialsEvent(this.id));
  }

  /**
   * Triggers user authenticated event.
   * @private
   */
  private triggerUserAuthenticatedEvent(): void {
    this.addEvent(new UserAuthenticatedEvent(this.id));
  }

  //#endregion

  //#region Getters

  /**
   * Gets the user's email address.
   * @returns {string} The user's email
   */
  get email(): string {
    return this._authentication.email;
  }

  /**
   * Gets the user's current status.
   * @returns {string} Current status value
   */
  get status(): string {
    return this._status.value;
  }

  /**
   * Gets the initial creation properties.
   * @returns {UserCreatedProperties} Creation state
   */
  get createdState(): UserCreatedProperties {
    return {
      userId: this.id,
      email: this.email,
      password: this._authentication.password,
      status: this._status.value,
    };
  }

  /**
   * Gets authenticated user data.
   * @private
   * @returns {UserAuthenticatedData} Authentication data
   */
  private get userAuthenticatedData(): UserAuthenticatedData {
    return {
      userId: this.id,
      email: this.email,
      fullName: this._information.fullName,
      status: this.status,
    };
  }

  //#endregion
}
