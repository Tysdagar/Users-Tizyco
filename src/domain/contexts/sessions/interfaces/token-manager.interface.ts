import { type ExposedUserData } from '../../users/types/user';

export const TOKEN_MANAGER_SERVICE = Symbol('ITokenManagerService');

export interface ITokenManagerService {
  generate(
    sessionId: string,
    payload: ExposedUserData,
    expiresIn: number,
  ): string;
}
