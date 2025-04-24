export const SECURE_LOGIN_SERVICE = Symbol('ISecurityLoginService');

export interface ISecureLoginService {
  resetAttempts(userId: string): Promise<void>;
  recordFailedAttempt(userId: string): Promise<void>;
  hasExceededAttemptLimit(userId: string): Promise<boolean>;
}
