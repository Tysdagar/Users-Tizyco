import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IStateDAOSync,
  StateVariable,
} from 'src/domain/common/interfaces/services/state-sync.interface';
import { PrismaClient } from 'src/infraestructure/configuration/clients/prisma.client';

@Injectable()
export class PrismaUserStatusDAO implements IStateDAOSync {
  constructor(private readonly db: PrismaClient) {}

  public async findAll(): Promise<StateVariable[]> {
    const statusValue = await this.db.userStatus.findMany();

    return statusValue.map((x) => {
      return { id: x.userStatusId, value: x.status };
    });
  }

  public async saveRange(values: string[]): Promise<void> {
    await this.db.userStatus.createMany({
      data: values.map((value) => {
        return { userStatusId: randomUUID(), status: value };
      }),
      skipDuplicates: true,
    });
  }
}
