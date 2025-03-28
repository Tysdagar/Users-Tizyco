import { SupportedValuesUtil } from 'src/domain/common/abstract/supported-values.abstract';

export enum MFAStatus {
  AUTHENTICATED = 'authenticated',
  FAILED = 'failed',
  INITIALIZED = 'initialized',
  NOT_STARTED = 'notstarted',
  EXPIRED = 'expired',
}

export class SupportedMFAStatus extends SupportedValuesUtil {
  public static isSupportedMFAStatus(gender: string): boolean {
    return this.isSupportedValue(MFAStatus, gender);
  }

  public static getSupportedMFAStatus(): string[] {
    return this.getSupportedValues(MFAStatus);
  }
}
