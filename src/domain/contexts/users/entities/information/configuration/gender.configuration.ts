import { SupportedValuesUtil } from 'src/domain/common/abstract/supported-values.abstract';

export enum Genders {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'nonbinary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefernottosay',
}

export class SupportedGenders extends SupportedValuesUtil {
  public static isSupportedGender(gender: string): boolean {
    return this.isSupportedValue(Genders, gender);
  }

  public static getSupportedGenders(): string[] {
    return this.getSupportedValues(Genders);
  }
}
