import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { SupportedStatus } from '../configuration/status.configuration';

export class Status extends ValueObject<string> {
  constructor(status: string) {
    super(status);
  }

  public validate(value: string): boolean {
    return this.validateStatus(value);
  }

  private validateStatus(status: string) {
    if (!status) {
      this.addError('Status', `Se requiere especificar el status del usuario.`);
      return false;
    }

    if (!SupportedStatus.isSupportedStatus(status)) {
      this.addError('Status', `Status desconocido: ${status}`);
      return false;
    }

    return true;
  }
}
