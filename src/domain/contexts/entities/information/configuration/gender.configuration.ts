import { SupportedValuesUtil } from 'src/domain/common/abstract/supported-values.abstract';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'nonbinary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefernottosay',
}

export class SupportedGenders extends SupportedValuesUtil {
  public static isSupportedGender(gender: string): boolean {
    return this.isSupportedValue(Gender, gender);
  }

  public static getSupportedGenders(): string[] {
    return this.getSupportedValues(Gender);
  }
}
