import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { FullNameData } from 'src/domain/contexts/types/user';

export class FullName extends ValueObject<FullNameData> {
  private static readonly INVALID_CHARACTERS: RegExp =
    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]/;
  private static readonly MAX_NAME_LENGTH: number = 50;

  constructor(firstName: string | null, lastName: string | null) {
    super({ firstName, lastName });
  }

  public validate(value: FullNameData): boolean {
    const { firstName, lastName } = value;

    if (!firstName && !lastName) {
      this.addError(
        'Nombre',
        'Se requiere al menos el nombre o el apellido del usuario.',
      );
      return false;
    }

    if (firstName) {
      this.validateName('Nombre', firstName);
    }

    if (lastName) {
      this.validateName('Apellido', lastName);
    }

    return this.hasNoErrors();
  }

  private validateName(fieldName: string, name: string): void {
    if (name.length > FullName.MAX_NAME_LENGTH) {
      this.addError(
        fieldName,
        `${fieldName} no puede tener más de ${FullName.MAX_NAME_LENGTH} caracteres.`,
      );
    }

    if (FullName.INVALID_CHARACTERS.test(name)) {
      this.addError(
        fieldName,
        `${fieldName} contiene caracteres no permitidos.`,
      );
    }
  }
}
