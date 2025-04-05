import { type VerificationUserData } from '../types/user';

export const VERIFICATION_USER_SERVICE = Symbol('IVerificationUserService');

export interface IVerificationUserService {
  saveVerificationCodeData(data: VerificationUserData): Promise<void>;
  getVerificationCodeData(userId: string): Promise<VerificationUserData | null>;
  removeVerificationCodeData(userId: string): Promise<void>;
}
