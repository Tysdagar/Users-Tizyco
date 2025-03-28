import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';

export class Phone extends ValueObject<string> {
  private static readonly E164_REGEX = /^\+([1-9]\d{0,3})(\d{7,})$/;

  constructor(phone: string) {
    super(phone);
  }

  public validate(phone: string): boolean {
    this.validatePhone(phone);

    return this.hasNoErrors ();
  }

  private validatePhone(phone: string): boolean {
    if (!phone) {
      this.addError('Teléfono', 'El número de teléfono es obligatorio.');
      return false;
    }

    const match = phone.match(Phone.E164_REGEX);
    if (!match) {
      this.addError('Teléfono', 'Número telefónico no válido.');
      return false;
    }

    const prefix = match[1];

    if (!this.isValidPrefix(prefix)) {
      this.addError('Teléfono', `Prefijo no válido: ${prefix}`);
      return false;
    }

    return true;
  }

  private isValidPrefix(prefix: string): boolean {
    return prefix.length >= 1 && prefix.length <= 4;
  }
}
