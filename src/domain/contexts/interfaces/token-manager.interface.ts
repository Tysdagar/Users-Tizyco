import { type ExposedUserData, type SessionUserData } from '../types/user';

export const TOKEN_MANAGER_SERVICE = Symbol('ITokenManagerService');

export interface ITokenManagerService {
  generate(payload: ExposedUserData): SessionUserData;
}
