import { type SessionData } from '../types/session';

export const SESSION_REPOSITORY = Symbol('ISessionRepository');

export interface ISessionRepository {
  save(sessionData: SessionData): Promise<void>;
}
