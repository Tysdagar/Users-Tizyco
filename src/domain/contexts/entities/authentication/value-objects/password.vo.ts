import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { PasswordData } from 'src/domain/contexts/types/user';

export class Password extends ValueObject<PasswordData> {
  private static readonly VALIDATION_REGEXES = {
    UPPERCASE: /[A-Z]/,
    LOWERCASE: /[a-z]/,
    SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>_\-+=/\\]/,
    LENGTH: /^.{8,}$/,
    NUMBER: /[0-9]/,
  };

  constructor(password: string, isSecured: boolean = false) {
    super({ password, isSecured });
  }

  public validate(passwordData: PasswordData): boolean {
    if (!passwordData.password) {
      this.addError('Contraseña', 'Se requiere una contraseña valida.');
      return false;
    }

    // Bypass password secured
    if (passwordData.isSecured === true && passwordData.password) {
      return true;
    }

    this.validatePassword(passwordData.password);

    if (!this.hasNoErrors()) {
      return false;
    }

    return true;
  }

  private validatePassword(password: string) {
    this.checkValidation(
      password,
      'UPPERCASE',
      'La contraseña debe contener al menos una mayúscula',
    );

    this.checkValidation(
      password,
      'LOWERCASE',
      'La contraseña debe contener al menos una minúscula',
    );

    this.checkValidation(
      password,
      'SPECIAL_CHAR',
      'La contraseña debe contener al menos un caracter especial',
    );

    this.checkValidation(
      password,
      'LENGTH',
      'La contraseña debe contener al menos 8 caracteres',
    );

    this.checkValidation(
      password,
      'NUMBER',
      'La contraseña debe contener al menos un número',
    );
  }

  private checkValidation(
    password: string,
    rule: keyof typeof Password.VALIDATION_REGEXES,
    errorMessage: string,
  ) {
    if (!Password.VALIDATION_REGEXES[rule].test(password)) {
      this.addError('Contraseña', errorMessage);
    }
  }
}
