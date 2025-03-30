import { SupportedValuesUtil } from 'src/domain/common/abstract/supported-values.abstract';

export enum UserStatus {
  VERIFIED = 'Verified',
  INACTIVE = 'Inactive',
  UNVERIFIED = 'Unverified',
  BLOCKED = 'Blocked',
  DELETED = 'Deleted',
}

export class SupportedStatus extends SupportedValuesUtil {
  public static isSupportedStatus(status: string): boolean {
    return this.isSupportedValue(UserStatus, status);
  }

  public static getSupportedStatus(): string[] {
    return this.getSupportedValues(UserStatus);
  }
}
