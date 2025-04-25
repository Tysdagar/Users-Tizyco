import { randomUUID } from 'crypto';
import { MFAStatus } from './configuration/mfa-status.configuration';
import { AuthenticationChannel } from './value-objects/authentication-channel.vo';
import { Code } from './value-objects/code.vo';
import { MultifactorStatus } from './value-objects/mfa-status.vo';
import { MULTIFACTOR_EXCEPTION_FACTORY } from './exceptions/multifactor-exception.factory';
import { type MultifactorMethodParams } from '../../types/user';

/**
 * Represents a Multi-Factor Authentication (MFA) method entity within the User aggregate.
 *
 * @remarks
 * This entity manages the lifecycle of an MFA method including generation/validation
 * of verification codes, activation status, and verification state. It enforces
 * strict business rules for MFA operations.
 *
 * @remarks
 * This is an entity that belongs to the User aggregate root.
 */
export class Multifactor {
  /**
   * Private constructor to enforce factory method usage.
   *
   * @param _multifactorId - Unique identifier for the MFA method
   * @param _authenticationChannel - Channel details (method + contact)
   * @param _active - Whether the method is currently active
   * @param _verified - Whether the method has been verified
   * @param _status - Current status of the MFA process
   * @param _code - Current verification code (if any)
   * @param _lastTimeUsed - Timestamp of last usage
   */
  private constructor(
    private readonly _multifactorId: string,
    private readonly _authenticationChannel: AuthenticationChannel,
    private _active = false,
    private _verified = false,
    private _status = new MultifactorStatus(MFAStatus.NOT_STARTED),
    private _code: Code | null = null,
    private _lastTimeUsed: Date | null = null,
  ) {
    this._multifactorId = _multifactorId;
    this._authenticationChannel = _authenticationChannel;
  }

  // Static Factory Methods

  /**
   * Creates a new MFA method instance.
   *
   * @param method - Authentication method (e.g., 'SMS', 'Email')
   * @param contact - Contact information for the method (e.g., phone number)
   * @returns New Multifactor instance
   */
  public static create(method: string, contact: string): Multifactor {
    return new Multifactor(
      randomUUID(),
      new AuthenticationChannel(method, contact),
    );
  }

  /**
   * Rebuilds an existing MFA method from persistence data.
   *
   * @param params - MFA method parameters including ID and status
   * @returns Configured Multifactor instance
   */
  public static build(params: MultifactorMethodParams): Multifactor {
    return new Multifactor(
      params.multifactorId,
      new AuthenticationChannel(params.method, params.contact),
      params.active,
      params.verified,
      new MultifactorStatus(params.status),
      null,
      params.lastTimeUsed,
    );
  }

  // Core Business Logic

  /**
   * Validates a provided verification code against the current code.
   *
   * @param code - Code to validate
   * @throws {MultifactorException} If validation fails for any reason
   */
  public validate(code: number): void {
    if (!this.isInitialized) {
      MULTIFACTOR_EXCEPTION_FACTORY.new('NOT_INITIALIZED');
    }

    if (this.isExpired || !this.getCode()) {
      this.setStatus(MFAStatus.EXPIRED);
      MULTIFACTOR_EXCEPTION_FACTORY.new('EXPIRED_CODE');
    }

    if (this.getCode() !== code) {
      this.setStatus(MFAStatus.FAILED);
      MULTIFACTOR_EXCEPTION_FACTORY.new('INVALID_CODE');
    }

    this.setStatus(MFAStatus.AUTHENTICATED);
  }

  /**
   * Initializes the MFA process by generating a new verification code.
   *
   * @throws {MultifactorException} If already authenticated, inactive, or code in progress
   */
  public initialize(): void {
    if (this.isAuthenticated) {
      throw MULTIFACTOR_EXCEPTION_FACTORY.new('ALREADY_AUTHENTICATED');
    }

    if (!this._active) {
      throw MULTIFACTOR_EXCEPTION_FACTORY.new('NOT_ACTIVE');
    }

    if (this.isInitialized) {
      throw MULTIFACTOR_EXCEPTION_FACTORY.new('CODE_IN_PROGRESS');
    }

    this.generateCode();
    this.updateLastTimeUsed();
    this.setStatus(MFAStatus.INITIALIZED);
  }

  // Verification Lifecycle Methods

  /**
   * Starts the verification process by generating a new code.
   *
   * @throws {MultifactorException} If already verified
   */
  public startVerification(): void {
    if (this._verified) {
      MULTIFACTOR_EXCEPTION_FACTORY.new('ALREADY_VERIFIED');
    }
    this.generateCode();
  }

  /**
   * Completes the verification process.
   *
   * @throws {MultifactorException} If already verified
   */
  public completeVerification(): void {
    if (this._verified) {
      MULTIFACTOR_EXCEPTION_FACTORY.new('ALREADY_VERIFIED');
    }
    this._verified = true;
  }

  // Activation Management

  /**
   * Activates the MFA method.
   *
   * @throws {MultifactorException} If not verified or already active
   */
  public activate(): void {
    if (!this._verified) {
      MULTIFACTOR_EXCEPTION_FACTORY.new('NOT_VERIFIED');
    }

    if (this._active) {
      MULTIFACTOR_EXCEPTION_FACTORY.new('ALREADY_ACTIVE');
    }

    this._active = true;
  }

  /**
   * Deactivates the MFA method.
   *
   * @throws {MultifactorException} If not active
   */
  public deactivate(): void {
    if (!this._active) {
      MULTIFACTOR_EXCEPTION_FACTORY.new('NOT_ACTIVE');
    }
    this._active = false;
  }

  // Private Helper Methods

  /**
   * Generates a new verification code.
   */
  private generateCode(): void {
    this._code = Code.create();
  }

  /**
   * Updates the MFA status.
   * @param status - New status to set
   */
  private setStatus(status: MFAStatus): void {
    this._status = new MultifactorStatus(status);
  }

  /**
   * Updates the last used timestamp to current time.
   */
  private updateLastTimeUsed(): void {
    this._lastTimeUsed = new Date();
  }

  // Property Accessors

  get params(): MultifactorMethodParams {
    return {
      multifactorId: this._multifactorId,
      method: this._authenticationChannel.value.method,
      contact: this._authenticationChannel.value.contact,
      active: this._active,
      verified: this._verified,
      status: this._status.value,
      lastTimeUsed: this._lastTimeUsed,
    };
  }

  /**
   * Gets the current verification code value.
   * @returns Current code or undefined
   */
  private getCode(): number | undefined {
    return this._code?.value.code;
  }

  /**
   * Checks if the MFA process has been initialized.
   */
  private get isInitialized(): boolean {
    return this._status.value === (MFAStatus.INITIALIZED as string);
  }

  /**
   * Checks if the MFA process has been successfully authenticated.
   */
  private get isAuthenticated(): boolean {
    return this._status.value === (MFAStatus.AUTHENTICATED as string);
  }

  /**
   * Checks if the current code has expired.
   */
  private get isExpired(): boolean {
    return this._status.value === (MFAStatus.EXPIRED as string);
  }
}
