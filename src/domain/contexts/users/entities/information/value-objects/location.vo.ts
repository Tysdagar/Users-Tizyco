import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { LocationData } from '../../../types/user';

export class Location extends ValueObject<LocationData> {
  private static readonly REQUIRED_DIGITS: RegExp = /^[a-zA-Z\s]{2,50}$/;

  constructor(country: string, city: string) {
    super({ country, city });
  }

  public validate(value: LocationData): boolean {
    if (!this.validateField('País', value.country)) {
      return false;
    }

    if (!this.validateField('Ciudad', value.city)) {
      return false;
    }

    return true;
  }

  private validateField(fieldName: string, value: string): boolean {
    if (!value) {
      this.addError(
        fieldName,
        `El nombre de ${fieldName.toLowerCase()} es obligatorio.`,
      );
      return false;
    }

    if (!Location.REQUIRED_DIGITS.test(value)) {
      this.addError(
        fieldName,
        `El nombre de ${fieldName.toLowerCase()} debe contener entre 2 y 50 caracteres y solo letras.`,
      );
      return false;
    }

    return true;
  }
}
