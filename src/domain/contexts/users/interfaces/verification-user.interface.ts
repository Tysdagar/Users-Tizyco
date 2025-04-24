export const VERIFICATION_USER_SERVICE = Symbol('IVerificationUserService');

export interface IVerificationUserService {
  isVerificationInProgress(userId: string): Promise<boolean>;
  initializeUserVerification(userId: string): Promise<void>;
  validateVerificationCode(userId: string, code: string): Promise<boolean>;
  finishUserVerification(userId: string): Promise<void>;
}
