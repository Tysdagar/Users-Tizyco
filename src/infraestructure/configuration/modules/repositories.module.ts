import { Global, Module } from '@nestjs/common';
import { SESSION_REPOSITORY } from 'src/domain/contexts/sessions/repositories/session.repository';
import { USER_REPOSITORY } from 'src/domain/contexts/users/repositories/user.repository';
import { SessionRepository } from 'src/infraestructure/repositories/session.repository';
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
    {
      provide: SESSION_REPOSITORY,
      useClass: SessionRepository,
    },
    PrismaUserStatusDAO,
  ],

  /**
   * Exported providers and tokens, making them available globally.
   */
  exports: [USER_REPOSITORY, SESSION_REPOSITORY, PrismaUserStatusDAO],
})
export class RepositoriesModule {}
