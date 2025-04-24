import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IStateDAOSync,
  StateVariable,
} from 'src/domain/common/interfaces/services/state-sync.interface';
import { PrismaClient } from 'src/infraestructure/configuration/clients/prisma.client';

@Injectable()
export class PrismaMultifactorMethodsDAO implements IStateDAOSync {
  constructor(private readonly db: PrismaClient) {}

  public async findAll(): Promise<StateVariable[]> {
    const statusValue = await this.db.multifactorMethods.findMany();

    return statusValue.map((x) => {
      return { id: x.supportedMethodId, value: x.method };
    });
  }

  public async saveRange(values: string[]): Promise<void> {
    await this.db.multifactorMethods.createMany({
      data: values.map((value) => {
        return { supportedMethodId: randomUUID(), method: value, active: true };
      }),
      skipDuplicates: true,
    });
  }
}
