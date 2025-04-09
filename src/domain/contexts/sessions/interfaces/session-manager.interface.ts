import { Sessions } from '../aggregate/user-sessions.aggregate';
import { type SessionData } from '../types/session';

export const USER_SESSIONS_MANAGER_SERVICE = Symbol(
  'IUserSessionsManagerService',
);

export interface IUserSessionsManagerService {
  startSession(
    userId: string,
    sessionData: SessionData,
    fingerPrintHash: string,
  ): Promise<void>;

  revokeSession(userId: string, fingerPrintHash: string): Promise<void>;

  getAll(userId: string): Promise<Sessions>;
}
