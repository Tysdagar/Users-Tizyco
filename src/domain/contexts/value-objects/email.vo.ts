import { ValueObject } from 'src/domain/common/utils/value-object.util';
import { ValueObjectErrorCollector } from 'src/domain/common/utils/vo-error-collector.util';

export class Email extends ValueObject<string> {
  private readonly EMAIL_REGEX: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    super();

    if (!value || value.length === 0) {
      ValueObjectErrorCollector.addError(
        'Email',
        'Este campo no puede ser vacio.',
      );
      return;
    }

    if (!this.EMAIL_REGEX.test(value)) {
      ValueObjectErrorCollector.addError(
        'Email',
        'Se requiere un correo valido.',
      );
      return;
    }

    this.setValue(value);
  }
}
