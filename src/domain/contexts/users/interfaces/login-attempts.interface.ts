export const LOGIN_ATTEMPTS_SERVICE = Symbol('ILoginAttemptService');

export interface ILoginAttemptService {
  resetAttempts(userId: string): Promise<void>;
  recordFailedAttempt(userId: string): Promise<void>;
  hasExceededAttemptLimit(userId: string): Promise<boolean>;
  blockUserTemporarily(userId: string): Promise<void>;
  isTemporarilyBlockedYet(userId: string): Promise<boolean>;
}
