import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';

export class Email extends ValueObject<string> {
  private static readonly EMAIL_REGEX: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    super(value);
  }

  public validate(value: string): boolean {
    if (!value || value.length === 0) {
      this.addError('Email', 'Este campo no puede ser vacio.');
      return false;
    }

    if (!Email.EMAIL_REGEX.test(value)) {
      this.addError('Email', 'Se requiere un correo valido.');
      return false;
    }

    return true;
  }
}
