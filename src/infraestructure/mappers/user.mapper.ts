import { User as UserEntity } from '@prisma/client';
import { UserPrismaDTO } from './user.dto';
import { User } from 'src/domain/contexts/users/aggregate/user.aggregate';
import { Authentication } from 'src/domain/contexts/users/entities/authentication/user-authentication.entity';
import { UserInformation } from 'src/domain/contexts/users/entities/information/user-information.entity';
import { Multifactor } from 'src/domain/contexts/users/entities/multifactor/user-multifactor.entity';

export class UserMapper {
  public static buildSecureAuthData(userDTO: UserPrismaDTO): User {
    const { userData } = userDTO.params;
    const { user, userStatus } = userData;

    return User.build({
      userId: user.userId,
      authentication: this.buildAuthentication(user),
      status: userStatus.status,
    });
  }

  public static buildAuthDataWithPassword(userDTO: UserPrismaDTO): User {
    const { userData } = userDTO.params;
    const { user, userStatus } = userData;

    return User.build({
      userId: user.userId,
      authentication: this.buildAuthentication(user, user.password),
      status: userStatus.status,
    });
  }

  public static buildWithInformation(userDTO: UserPrismaDTO): User {
    const { userData } = userDTO.params;
    const { user, userStatus } = userData;

    return User.build({
      userId: user.userId,
      authentication: this.buildAuthentication(user),
      status: userStatus.status,
      information: UserInformation.build({
        firstName: user.firstName,
        lastName: user.lastName,
        city: user.city,
        country: user.country,
        gender: user.gender,
        phone: user.phone,
      }),
    });
  }

  public static buildWithMFAMethods(userDTO: UserPrismaDTO): User {
    const { userData, multifactorMethods } = userDTO.params;
    const { user, userStatus } = userData;

    return User.build({
      userId: user.userId,
      authentication: this.buildAuthentication(user, user.password),
      status: userStatus.status,
      multifactorMethods: multifactorMethods.map(
        ({ mfaInfo, mfaMethod, mfaStatus }) => {
          return Multifactor.build({
            multifactorId: mfaInfo.multifactorMethodId,
            active: mfaInfo.active,
            contact: mfaInfo.contact,
            verified: mfaInfo.verified,
            lastTimeUsed: mfaInfo.lastTimeUsed,
            method: mfaMethod.method,
            status: mfaStatus.status,
          });
        },
      ),
    });
  }

  private static buildAuthentication(
    user: UserEntity,
    password?: string,
  ): Authentication {
    return password
      ? Authentication.build(user.email, password)
      : Authentication.build(user.email);
  }
}
