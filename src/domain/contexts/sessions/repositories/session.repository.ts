import { type SessionData } from '../types/session';

export const SESSION_REPOSITORY = Symbol('ISessionRepository');

export interface ISessionRepository {
  save(userId: string, sessionData: SessionData): Promise<void>;
}
