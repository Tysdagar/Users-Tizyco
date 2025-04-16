import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';

export class RefreshSessionRequest {
  constructor(
    public readonly userAuthenticatedData: UserAuthenticatedData,
    public readonly refreshToken: string,
  ) {}
}
