import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class Authentication {
  private constructor(
    private email: Email,
    private password: Password,
  ) {
    this.email = email;
    this.password = password;
  }

  public static create(email: string, password: string): Authentication {
    return new Authentication(new Email(email), new Password(password));
  }
}
