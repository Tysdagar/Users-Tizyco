import { StateSyncService } from 'src/infraestructure/services/state-sync.service';
import { RepositoriesModule } from './repositories.module';
import { Module } from '@nestjs/common';
import { PrismaUserStatusDAO } from 'src/infraestructure/repositories/user-status.DAO';
import { SupportedUserStatus } from 'src/domain/contexts/aggregate/configuration/status.configuration';

/**
 * The `EnumSyncModule` is responsible for synchronizing the application's
 * configuration enums with the database. This ensures that the database
 * tables for enums are always up to date with the application's supported
 * values.
 */
@Module({
  /**
   * Import dependencies required by this module.
   */
  imports: [RepositoriesModule],

  /**
   * Define the `StateSyncService` and its dependencies.
   */
  providers: [
    {
      /**
       * A factory provider for `StateSyncService` that initializes and synchronizes
       * enum data with the database.
       */
      provide: StateSyncService,
      useFactory: async (userStatusDAO: PrismaUserStatusDAO) => {
        const service = new StateSyncService();

        service.setEnumDAO(userStatusDAO);
        await service.syncEnumTables(
          SupportedUserStatus.getSupportedUserStatus(),
        );

        return service;
      },
      /**
       * Inject the required DAO dependencies into the factory function.
       */
      inject: [PrismaUserStatusDAO],
    },
  ],

  /**
   * Export the `StateSyncService` to make it available for other modules.
   */
  exports: [StateSyncService],
})
export class EnumSyncModule {}
