import { IPasswordSecurityService } from '../../interfaces/password-security.interface';
import { AUTH_EXCEPTION_FACTORY } from './exceptions/authentication-exception.factory';
import { Email } from './value-objects/email.vo';
import { Password } from './value-objects/password.vo';

export class Authentication {
  private constructor(
    private _email: Email,
    private _password: Password,
  ) {
    this._email = _email;
    this._password = _password;
  }

  public static create(email: string, password: string): Authentication {
    return new Authentication(new Email(email), new Password(password));
  }

  public updateEmail(newEmail: string) {
    const updatedEmail = new Email(newEmail);

    if (this._email.equals(updatedEmail)) {
      AUTH_EXCEPTION_FACTORY.throw('SAME_EMAIL_UPDATE');
    }

    this._email = updatedEmail;
  }

  public updatePassword(newPassword: string) {
    this._password = new Password(newPassword);
  }

  public securePassword(passwordService: IPasswordSecurityService) {
    this._password = new Password(passwordService.secure(this.password), true);
  }

  get email(): string {
    return this._email.value;
  }

  get password(): string {
    return this._password.value.password;
  }
}
