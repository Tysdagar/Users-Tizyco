import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { SupportedGenders } from '../configuration/gender.configuration';

export class Gender extends ValueObject<string> {
  constructor(gender: string) {
    super(gender);
  }

  public validate(gender: string): boolean {
    return this.validateGender(gender);
  }

  private validateGender(gender: string) {
    if (!gender) {
      this.addError('Genero', `Se requiere especificar el genero.`);
      return false;
    }

    if (!SupportedGenders.isSupportedGender(gender)) {
      this.addError('Genero', `Genero desconocido: ${gender}`);
      return false;
    }

    return true;
  }
}
