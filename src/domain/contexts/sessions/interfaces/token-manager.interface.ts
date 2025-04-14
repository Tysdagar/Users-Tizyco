import { type UserAuthenticatedData } from '../../users/types/user';

export const TOKEN_MANAGER_SERVICE = Symbol('ITokenManagerService');

export interface ITokenManagerService {
  generate(
    sessionId: string,
    payload: UserAuthenticatedData,
    expiresIn: number,
  ): string;
}
