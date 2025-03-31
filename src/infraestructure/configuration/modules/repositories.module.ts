import { Global, Module } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/domain/contexts/repositories/user.repository';
import { PrismaUserStatusDAO } from 'src/infraestructure/repositories/user-status.DAO';
import { PrismaUserRepository } from 'src/infraestructure/repositories/user.repository';

/**
 * The `RepositoriesModule` is a global module responsible for providing
 * repository and DAO implementations for various application contexts.
 */
@Global()
@Module({
  /**
   * Services and implementations registered as providers.
   */
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    PrismaUserStatusDAO,
  ],

  /**
   * Exported providers and tokens, making them available globally.
   */
  exports: [USER_REPOSITORY, PrismaUserStatusDAO],
})
export class RepositoriesModule {}
