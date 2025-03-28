import { SupportedValuesUtil } from 'src/domain/common/abstract/supported-values.abstract';

export enum MFAMethods {
  SMS = 'sms',
  EMAIL = 'email',
}

export class SupportedMFAMethods extends SupportedValuesUtil {
  public static isSupportedMFAMethod(gender: string): boolean {
    return this.isSupportedValue(MFAMethods, gender);
  }

  public static getSupportedMFAMethods(): string[] {
    return this.getSupportedValues(MFAMethods);
  }
}
