import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IStateDAOSync,
  StateVariable,
} from 'src/domain/common/interfaces/services/state-sync.interface';
import { PrismaClient } from 'src/infraestructure/configuration/clients/prisma.client';

@Injectable()
export class PrismaMultifactorStatusDAO implements IStateDAOSync {
  constructor(private readonly db: PrismaClient) {}

  public async findAll(): Promise<StateVariable[]> {
    const statusValue = await this.db.multifactorStatus.findMany();

    return statusValue.map((x) => {
      return { id: x.multifactorStatusId, value: x.status };
    });
  }

  public async saveRange(values: string[]): Promise<void> {
    await this.db.multifactorStatus.createMany({
      data: values.map((value) => {
        return {
          multifactorStatusId: randomUUID(),
          status: value,
        };
      }),
      skipDuplicates: true,
    });
  }
}
