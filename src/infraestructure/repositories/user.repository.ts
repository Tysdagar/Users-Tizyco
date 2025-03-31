import { User } from 'src/domain/contexts/aggregate/user.aggregate';
import { IUserRepository } from 'src/domain/contexts/repositories/user.repository';
import { PrismaClient } from '../configuration/clients/prisma.client';
import { GlobalVariablesClient } from '../configuration/clients/global-variables.client';
import { Injectable } from '@nestjs/common';

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

  public async existsByEmail(email: string): Promise<boolean> {
    return (await this.db.user.findUnique({ where: { email } })) !== null;
  }
}
