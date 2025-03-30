import { ValueObject } from 'src/domain/common/abstract/value-object.abstract';
import {
  MFAStatus,
  SupportedMFAStatus,
} from '../configuration/mfa-status.configuration';

export class MultifactorStatus extends ValueObject<MFAStatus> {
  constructor(status: MFAStatus) {
    super(status);
  }

  public validate(value: MFAStatus): boolean {
    return this.validateStatus(value);
  }

  private validateStatus(status: MFAStatus) {
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
