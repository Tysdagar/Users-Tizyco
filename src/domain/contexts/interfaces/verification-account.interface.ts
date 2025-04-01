import { type VerificationUserData } from '../types/user';

export const VERIFICATION_USER_SERVICE = Symbol('IVerificationUserService');

export interface IVerificationUserService {
  saveVerificationData(data: VerificationUserData): Promise<void>;
  getVerificationCode(userId: string): Promise<VerificationUserData | null>;
  removeVerificationData(userId: string): Promise<void>;
}
