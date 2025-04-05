import { Authentication } from '../entities/authentication/user-authentication.entity';
import { UserInformation } from '../entities/information/user-information.entity';
import { Multifactor } from '../entities/multifactor/user-multifactor.entity';

export interface UserInformationParams {
  firstName: string | null;
  lastName: string | null;
  country: string | null;
  city: string | null;
  phone: string | null;
  gender: string | null;
}

export interface UserParams {
  userId: string;
  authentication: Authentication;
  status: string;
  information?: UserInformation;
  multifactorMethods?: Multifactor[];
}

export interface MultifactorMethodParams {
  multifactorId: string;
  method: string;
  contact: string;
  active: boolean;
  verified: boolean;
  status: string;
  lastTimeUsed: Date | null;
}

export interface UserCreatedProperties {
  userId: string;
  email: string;
  password: string;
  status: string;
}

export interface VerificationUserData {
  userId: string;
  code: string;
  expiresDate: Date;
}

export interface SessionUserData {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn?: number;
}

export interface ExposedUserData {
  sub: string;
  email: string;
  status: string;
  fullName: string | null;
}

export type FullNameData = {
  firstName: string | null;
  lastName: string | null;
};

export type LocationData = { country: string; city: string };
export type PasswordData = { password: string; isSecured: boolean };
export type AuthenticationChannelData = { method: string; contact: string };
export type MultifactorCodeData = { code: number; TTL: number };

export type OperationResult = { success: boolean };
