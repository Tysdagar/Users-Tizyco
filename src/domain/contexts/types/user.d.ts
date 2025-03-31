export interface UserInformationParams {
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  phone?: string;
  gender?: string;
}

export interface UserCreatedProperties {
  userId: string;
  email: string;
  password: string;
  status: string;
}

export type FullNameData = { firstName?: string; lastName?: string };
export type LocationData = { country: string; city: string };
export type PasswordData = { password: string; isSecured: boolean };
export type AuthenticationChannelData = { method: string; contact: string };
export type MultifactorCodeData = { code: number; TTL: number };

export type OperationResult = { success: boolean };
