import { ValueObject } from 'src/domain/common/utils/value-object.util';
import { ValueObjectErrorCollector } from 'src/domain/common/utils/vo-error-collector.util';

export class Password extends ValueObject<string> {
  private readonly UPPERCASE_REGEX: RegExp = /.*[A-Z].*/;
  private readonly LOWERCASE_REGEX: RegExp = /.*[a-z].*/;
  private readonly SPECIAL_CHAR_REGEX: RegExp =
    /.*[!@#$%^&*(),.?":{}|<>_\-+=/\\].*/;
  private readonly LENGTH_REGEX: RegExp = /^.{8,}$/;
  private readonly NUMBER_REGEX: RegExp = /.*[0-9].*/;

  constructor(value: string) {
    super();

    if (!value || value.length === 0) {
      ValueObjectErrorCollector.addError(
        'Contraseña',
        'Se requiere una contraseña en este campo',
      );
      return;
    }

    if (!this.UPPERCASE_REGEX.test(value)) {
      ValueObjectErrorCollector.addError(
        'Contraseña',
        'La contraseña debe contener al menos una mayuscula',
      );
    }

    if (!this.LOWERCASE_REGEX.test(value)) {
      ValueObjectErrorCollector.addError(
        'Contraseña',
        'La contraseña debe contener al menos una minuscula',
      );
    }

    if (!this.SPECIAL_CHAR_REGEX.test(value)) {
      ValueObjectErrorCollector.addError(
        'Contraseña',
        'La contraseña debe contener al menos un caracter especial',
      );
    }

    if (!this.LENGTH_REGEX.test(value)) {
      ValueObjectErrorCollector.addError(
        'Contraseña',
        'La contraseña debe contener al menos 8 caracteres',
      );
    }

    if (!this.NUMBER_REGEX.test(value)) {
      ValueObjectErrorCollector.addError(
        'Contraseña',
        'La contraseña debe contener de 0 a 9 numeros',
      );
    }

    if (ValueObjectErrorCollector.hasErrors()) {
      return;
    }

    this.setValue(value);
  }
}
