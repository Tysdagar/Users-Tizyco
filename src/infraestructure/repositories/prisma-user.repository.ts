import { User } from 'src/domain/contexts/users/aggregate/user.aggregate';
import { PrismaClient } from '../configuration/clients/prisma.client';
import { GlobalVariablesClient } from '../configuration/clients/global-variables.client';
import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';
import { UserPrismaDTO } from '../mappers/user.dto';
import {
  MultifactorMethod,
  MultifactorMethods,
  MultifactorStatus,
} from '@prisma/client';
import { IUserRepository } from 'src/domain/contexts/users/repositories/user.repository';
import { Multifactor } from 'src/domain/contexts/users/entities/multifactor/user-multifactor.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  public async save(user: User): Promise<void> {
    const { email, password, status, userId } = user.createdState;

    await this.db.user.create({
      data: {
        userId: userId,
        email,
        password,
        userStatusId: GlobalVariablesClient.getKey(status),
      },
    });
  }

  public async saveMultifactorMethod(
    userId: string,
    multifactor: Multifactor,
  ): Promise<void> {
    const {
      multifactorId,
      method,
      contact,
      active,
      verified,
      status,
      lastTimeUsed,
    } = multifactor.params;

    await this.db.multifactorMethod.create({
      data: {
        multifactorMethodId: multifactorId,
        supportedMethodId: GlobalVariablesClient.getKey(method),
        contact,
        statusId: GlobalVariablesClient.getKey(status),
        active,
        verified,
        lastTimeUsed: lastTimeUsed,
        userId,
      },
    });
  }

  public async updateUserStatus(userId: string, status: string): Promise<void> {
    await this.db.user.update({
      where: { userId },
      data: { userStatusId: GlobalVariablesClient.getKey(status) },
    });
  }

  public async existsUserByEmail(email: string): Promise<boolean> {
    return (await this.db.user.findUnique({ where: { email } })) !== null;
  }

  public async findAuthDataWithMFA(userId: string): Promise<User | null> {
    const user = await this.getUserById({ userId }, true);

    if (!user) return null;

    return UserMapper.buildWithMFAMethods(user);
  }

  public async findAuthDataWithPassword(email: string): Promise<User | null> {
    const user = await this.getUserById({ email });

    if (!user) return null;

    return UserMapper.buildAuthDataWithPassword(user);
  }

  public async findUserInfo(userId: string): Promise<User | null> {
    const user = await this.getUserById({ userId });

    if (!user) return null;

    return UserMapper.buildWithInformation(user);
  }

  public async findSecureAuthData(userId: string): Promise<User | null> {
    const user = await this.getUserById({ userId });

    if (!user) return null;

    return UserMapper.buildSecureAuthData(user);
  }

  private async getUserById(
    params: { userId?: string; email?: string },
    includeMultifactors: boolean = false,
  ): Promise<UserPrismaDTO | null> {
    const whereClause = this.buildWhereClause(params);

    if (!whereClause) return null;

    const user = await this.db.user.findUnique({
      where: whereClause,
      include: this.buildIncludeOptions(includeMultifactors),
    });

    if (!user) return null;

    const multifactorData = includeMultifactors
      ? this.mapMultifactor(user.multifactorMethods)
      : [];

    return new UserPrismaDTO({
      userData: { user, userStatus: user.userStatus },
      multifactorMethods: multifactorData,
    });
  }

  private mapMultifactor(multifactorMethods: MultifactorMethod[]) {
    return (
      multifactorMethods as Array<
        MultifactorMethod & {
          supportedMethod: MultifactorMethods;
          multifactorStatus: MultifactorStatus;
        }
      >
    ).map((multifactor) => ({
      mfaInfo: multifactor,
      mfaMethod: multifactor.supportedMethod,
      mfaStatus: multifactor.multifactorStatus,
    }));
  }

  private buildWhereClause(params: { userId?: string; email?: string }) {
    if (params.userId) return { userId: params.userId };
    if (params.email) return { email: params.email };
    return null;
  }

  private buildIncludeOptions(includeMultifactors: boolean) {
    return {
      userStatus: true,
      multifactorMethods: includeMultifactors
        ? {
            include: {
              supportedMethod: true,
              multifactorStatus: true,
            },
          }
        : false,
    };
  }
}
