import {
  MultifactorMethod,
  MultifactorMethods,
  MultifactorStatus,
  User,
  UserStatus,
} from '@prisma/client';

interface UserPrismaParams {
  userData: { user: User; userStatus: UserStatus };
  multifactorMethods: {
    mfaInfo: MultifactorMethod;
    mfaStatus: MultifactorStatus;
    mfaMethod: MultifactorMethods;
  }[];
}

export class UserPrismaDTO {
  constructor(public readonly params: UserPrismaParams) {}
}
