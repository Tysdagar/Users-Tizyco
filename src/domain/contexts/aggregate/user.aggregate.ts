import { randomUUID } from 'crypto';
import { Authentication } from '../entities/authentication/user-authentication.entity';
import { UserInformation } from '../entities/information/user-information.entity';
import { Multifactor } from '../entities/multifactor/user-multifactor.entity';
import { OperationResult, UserInformationParams } from '../types/user';
import { Status } from './value-objects/status.vo';
import { UserStatus } from './configuration/status.configuration';
import { AggregateRoot } from 'src/domain/common/abstract/aggregate-root.abstract';
import { IPasswordSecurityService } from '../interfaces/password-security.interface';
import { MultifactorException } from '../entities/multifactor/exceptions/multifactor.exception';
import { USER_EXCEPTION_FACTORY } from './exceptions/user-exception.factory';

export class User extends AggregateRoot {
  private constructor(
    private readonly _userId: string,
    private readonly authentication: Authentication,
    private _status: Status,
    private readonly information: UserInformation = UserInformation.initialize(),
    private readonly multifactors: Multifactor[] = [],
  ) {
    super();
    this._userId = _userId;
    this.authentication = authentication;
    this._status = _status;
  }

  // Create Operations

  public static create(email: string, password: string): User {
    return new User(
      randomUUID(),
      Authentication.create(email, password),
      new Status(UserStatus.UNVERIFIED),
    );
  }

  private addMultifactorMethod() {}

  // Update Operations

  public updateAuthentication(email?: string, password?: string) {
    if (!email && !password) {
      USER_EXCEPTION_FACTORY.throw('AT_LEAST_ONE_AUTH_PROPERTY_REQUIRED');
    }

    if (email) {
      this.authentication.updateEmail(email);
    }

    if (password) {
      this.authentication.updatePassword(password);
    }
  }

  public updateUserInformation(information: UserInformationParams) {
    this.information.update(information);
  }

  // Checking Business Data Operations

  private checkRequiredMultifactorGuard(): void {
    try {
      const multifactor = this.findMultifactorActiveMethod();

      if (!multifactor) {
        return;
      }

      this.startMultifactorAuthentication(multifactor);
    } catch (error) {
      this.handleCheckingMultifactorException(error);
    }
  }

  private checkUserHasValidStatusGuard() {
    if (this.validateStatus(UserStatus.BLOCKED)) {
      USER_EXCEPTION_FACTORY.throw('USER_BLOCKED');
    }

    if (this.validateStatus(UserStatus.DELETED)) {
      USER_EXCEPTION_FACTORY.throwValidation('USER_DELETED');
    }
  }

  private checkCredentialsGuard(
    passwordService: IPasswordSecurityService,
    password: string,
  ) {
    const isPasswordCorrect = passwordService.check(
      password,
      this.authentication.password,
    );
    if (!isPasswordCorrect) {
      USER_EXCEPTION_FACTORY.throw('INVALID_CREDENTIALS');
    }
  }

  // Misc Operations

  private findMultifactorActiveMethod(): Multifactor | void {
    return this.multifactors.find(
      (multifactor) => multifactor.isActive === true,
    );
  }

  private validateStatus(status: string) {
    if (this._status.value === status) {
      return true;
    }
  }

  private startMultifactorAuthentication(multifactor: Multifactor) {
    this.initializeMultifactorAuthentication(multifactor);
    USER_EXCEPTION_FACTORY.throw('MULTIFACTOR_AUTH_INITIALIZED');
  }

  private reTryMultifactorAuthentication(multifactor: Multifactor) {
    this.initializeMultifactorAuthentication(multifactor);
    USER_EXCEPTION_FACTORY.throw('MULTIFACTOR_AUTH_REINITIALIZED');
  }

  // Business Operations

  public tryLogin(
    passwordService: IPasswordSecurityService,
    password: string,
  ): OperationResult {
    this.checkCredentialsGuard(passwordService, password);
    this.checkUserHasValidStatusGuard();
    this.checkRequiredMultifactorGuard();
    return this.triggerSuccessfullyLogin();
  }

  private triggerSuccessfullyLogin(): OperationResult {
    return { success: true };
  }

  private initializeMultifactorAuthentication(multifactor: Multifactor) {
    multifactor.initialize();
  }

  public securePassword(passwordService: IPasswordSecurityService) {
    this.authentication.securePassword(passwordService);
  }

  // Domain Exceptions

  private handleCheckingMultifactorException(error: unknown): void {
    if (error instanceof MultifactorException) {
      if (error.matchesErrorKey('ALREADY_AUTHENTICATED')) {
        return;
      }
    }
    throw error;
  }

  // Status

  public verify() {
    this._status = new Status(UserStatus.ACTIVE);
  }

  public deactive() {
    this._status = new Status(UserStatus.INACTIVE);
  }

  public delete() {
    this._status = new Status(UserStatus.DELETED);
  }

  public block() {
    this._status = new Status(UserStatus.BLOCKED);
  }

  // Getters

  get userId(): string {
    return this._userId;
  }
}
