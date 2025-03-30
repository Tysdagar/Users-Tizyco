import { randomUUID } from 'crypto';
import { MFAStatus } from './configuration/mfa-status.configuration';
import { AuthenticationChannel } from './value-objects/authentication-channel.vo';
import { Code } from './value-objects/code.vo';
import { MultifactorStatus } from './value-objects/mfa-status.vo';
import { MULTIFACTOR_EXCEPTION_FACTORY } from './exceptions/multifactor-exception.factory';

export class Multifactor {
  private readonly _multifactorId: string;
  private readonly _authenticationChannel: AuthenticationChannel;
  private _active = false;
  private _verified = false;
  private _status = new MultifactorStatus(MFAStatus.NOT_STARTED);
  private _code: Code | null = null;
  private _lastTimeUsed: Date | null = null;

  private constructor(
    multifactorId: string,
    authenticationChannel: AuthenticationChannel,
  ) {
    this._multifactorId = multifactorId;
    this._authenticationChannel = authenticationChannel;
  }

  public static create(method: string, contact: string): Multifactor {
    return new Multifactor(
      randomUUID(),
      new AuthenticationChannel(method, contact),
    );
  }

  public validate(code: number): void {
    if (!this.isInitialized) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('NOT_INITIALIZED');
    }

    if (this.isExpired || !this.getCode()) {
      this.setStatus(MFAStatus.EXPIRED);
      MULTIFACTOR_EXCEPTION_FACTORY.throw('EXPIRED_CODE');
    }

    if (this.getCode() !== code) {
      this.setStatus(MFAStatus.FAILED);
      MULTIFACTOR_EXCEPTION_FACTORY.throw('INVALID_CODE');
    }

    this.setStatus(MFAStatus.AUTHENTICATED);
  }

  public initialize(): void {
    if (this.isAuthenticated) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('ALREADY_AUTHENTICATED');
    }

    if (!this.isActive) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('NOT_ACTIVE');
    }

    if (this.isInitialized) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('CODE_IN_PROGRESS');
    }

    this.generateCode();
    this.updateLastTimeUsed();
    this.setStatus(MFAStatus.INITIALIZED);
  }

  public startVerification(): void {
    if (this.isVerified) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('ALREADY_VERIFIED');
    }
    this.generateCode();
  }

  public completeVerification(): void {
    if (this.isVerified) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('ALREADY_VERIFIED');
    }
    this._verified = true;
  }

  public activate(): void {
    if (!this.isVerified) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('NOT_VERIFIED');
    }

    if (this.isActive) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('ALREADY_ACTIVE');
    }

    this._active = true;
  }

  public deactivate(): void {
    if (!this.isActive) {
      MULTIFACTOR_EXCEPTION_FACTORY.throw('NOT_ACTIVE');
    }
    this._active = false;
  }

  private generateCode(): void {
    this._code = Code.create();
  }

  private setStatus(status: MFAStatus): void {
    this._status = new MultifactorStatus(status);
  }

  private updateLastTimeUsed() {
    this._lastTimeUsed = new Date();
  }

  // Getters
  get multifactorId(): string {
    return this._multifactorId;
  }

  get method(): string {
    return this._authenticationChannel.value.method;
  }

  get contact(): string {
    return this._authenticationChannel.value.contact;
  }

  get isActive(): boolean {
    return this._active;
  }

  private getCode() {
    return this._code?.value.code;
  }

  private get isVerified(): boolean {
    return this._verified;
  }

  private get isInitialized(): boolean {
    return this._status.value === MFAStatus.INITIALIZED;
  }

  private get isAuthenticated(): boolean {
    return this._status.value === MFAStatus.AUTHENTICATED;
  }

  private get isExpired(): boolean {
    return this._status.value === MFAStatus.EXPIRED;
  }
}
