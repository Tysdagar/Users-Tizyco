import { Injectable, OnModuleInit } from '@nestjs/common';
import { SupportedUserStatus } from 'src/domain/contexts/users/aggregate/configuration/status.configuration';
import { SupportedMFAMethods } from 'src/domain/contexts/users/entities/multifactor/configuration/method.configuration';
import { SupportedMFAStatus } from 'src/domain/contexts/users/entities/multifactor/configuration/mfa-status.configuration';
import { StateSyncService } from 'src/infraestructure/helpers/state-sync.service';
import { PrismaMultifactorMethodsDAO } from 'src/infraestructure/repositories/prisma-multifactor-methods.DAO';
import { PrismaMultifactorStatusDAO } from 'src/infraestructure/repositories/prisma-multifactor-status.DAO';
import { PrismaUserStatusDAO } from 'src/infraestructure/repositories/prisma-user-status.DAO';

@Injectable()
export class ConfigVariablesModule implements OnModuleInit {
  constructor(
    private readonly userStatusDAO: PrismaUserStatusDAO,
    private readonly multifactorMethods: PrismaMultifactorMethodsDAO,
    private readonly multifactorStatus: PrismaMultifactorStatusDAO,
  ) {}

  async onModuleInit() {
    await Promise.all([
      StateSyncService.syncEnumTables(
        this.userStatusDAO,
        SupportedUserStatus.getSupportedUserStatus(),
      ),
      StateSyncService.syncEnumTables(
        this.multifactorMethods,
        SupportedMFAMethods.getSupportedMFAMethods(),
      ),
      StateSyncService.syncEnumTables(
        this.multifactorStatus,
        SupportedMFAStatus.getSupportedMFAStatus(),
      ),
    ]);
  }
}
