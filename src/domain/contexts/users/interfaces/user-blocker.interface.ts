export const USER_BLOCKER_SERVICE = Symbol('IUserBlockerService');

export interface IUserBlockerService {
  blockUser(userId: string): Promise<void>;
  isTemporarilyBlockedYet(userId: string): Promise<boolean>;
}
