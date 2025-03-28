import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import { SupportedMFAStatus } from '../configuration/mfa-status.configuration';

export class MultifactorStatus extends ValueObject<string> {
  constructor(status: string) {
    super(status);
  }

  public validate(value: string): boolean {
    return this.validateStatus(value);
  }

  private validateStatus(status: string) {
    if (!status) {
      this.addError(
        'Status',
        `Se requiere especificar el status del multifactor.`,
      );
      return false;
    }

    if (!SupportedMFAStatus.isSupportedMFAStatus(status)) {
      this.addError('Status', `Status desconocido: ${status}`);
      return false;
    }

    return true;
  }
}
