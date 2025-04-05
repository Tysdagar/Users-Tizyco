import { DomainException } from 'src/domain/common/errors/configuration/domain.exception';
import { IPasswordSecurityService } from '../../interfaces/password-security.interface';
import { AUTH_EXCEPTION_FACTORY } from './exceptions/authentication-exception.factory';
import { Email } from './value-objects/email.vo';
import { Password } from './value-objects/password.vo';

/**
 * Represents the authentication details of a user.
 * Encapsulates email and password with validation logic and security operations.
 *
 * @remarks
 * This is an entity that belongs to the User aggregate root.
 */
export class Authentication {
  /**
   * Private constructor to enforce factory method usage.
   *
   * @param _email - The user's email address as a Value Object.
   * @param _password - The user's password (optional) as a Value Object.
   */
  private constructor(
    private _email: Email,
    private _password?: Password,
  ) {
    this._email = _email;
    this._password = _password;
  }

  // Static Factory Methods

  /**
   * Creates a new Authentication instance with email and password.
   *
   * @param email - Raw email string (will be validated).
   * @param password - Raw password string (will be validated).
   * @returns New Authentication instance.
   */
  public static create(email: string, password: string): Authentication {
    return new Authentication(new Email(email), new Password(password));
  }

  /**
   * Builds an Authentication instance, optionally with password.
   * Useful for reconstruction from persistence.
   *
   * @param email - Raw email string (will be validated).
   * @param password - Optional raw password string.
   * @returns Configured Authentication instance.
   */
  public static build(email: string, password?: string): Authentication {
    const auth = new Authentication(new Email(email));
    if (password) auth.setSecurePassword(password);
    return auth;
  }

  // Business Logic Methods

  /**
   * Updates the email address after validation.
   *
   * @param newEmail - New email address.
   * @throws {AuthException} If the new email is the same as the current one.
   */
  public updateEmail(newEmail: string): void {
    const updatedEmail = new Email(newEmail);

    if (this._email.equals(updatedEmail)) {
      AUTH_EXCEPTION_FACTORY.throw('SAME_EMAIL_UPDATE');
    }

    this._email = updatedEmail;
  }

  /**
   * Updates the password with a new raw value.
   *
   * @param newPassword - New raw password string.
   */
  public updatePassword(newPassword: string): void {
    this._password = new Password(newPassword);
  }

  /**
   * Secures the password using the provided security service.
   *
   * @param passwordService - Service to hash/secure the password.
   */
  public async securePassword(
    passwordService: IPasswordSecurityService,
  ): Promise<void> {
    this.setSecurePassword(await passwordService.secure(this.password));
  }

  /**
   * Sets a pre-secured password (hashed/encrypted).
   *
   * @param password - Already secured password string.
   */
  private setSecurePassword(password: string): void {
    this._password = new Password(password, true);
  }

  public async checkCredentials(
    password: string,
    passwordService: IPasswordSecurityService,
  ) {
    return await passwordService.check(password, this.password);
  }

  // Getters

  /**
   * Gets the email address as a string.
   *
   * @returns The email value.
   */
  get email(): string {
    return this._email.value;
  }

  /**
   * Gets the password value.
   *
   * @returns The password string.
   * @throws {DomainException} If password is not available.
   */
  get password(): string {
    if (!this._password)
      throw new DomainException('No se obtuvo correctamente la contraseña');
    return this._password.value.password;
  }
}
