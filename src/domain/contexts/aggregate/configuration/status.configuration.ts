import { SupportedValuesUtil } from 'src/domain/common/abstract/supported-values.abstract';

export enum UserStatus {
  VERIFIED = 'Verified',
  INACTIVE = 'Inactive',
  UNVERIFIED = 'Unverified',
  BLOCKED = 'Blocked',
  DELETED = 'Deleted',
}

export class SupportedUserStatus extends SupportedValuesUtil {
  public static isSupportedUserStatus(status: string): boolean {
    return this.isSupportedValue(UserStatus, status);
  }

  public static getSupportedUserStatus(): string[] {
    return this.getSupportedValues(UserStatus);
  }
}
