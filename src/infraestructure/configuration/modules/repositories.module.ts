import { Global, Module } from '@nestjs/common';
import { USER_SESSIONS_MANAGER_SERVICE } from 'src/domain/contexts/sessions/interfaces/session-manager.interface';
import { USER_REPOSITORY } from 'src/domain/contexts/users/repositories/user.repository';
import { PrismaMultifactorMethodsDAO } from 'src/infraestructure/repositories/prisma-multifactor-methods.DAO';
import { PrismaMultifactorStatusDAO } from 'src/infraestructure/repositories/prisma-multifactor-status.DAO';
import { PrismaUserStatusDAO } from 'src/infraestructure/repositories/prisma-user-status.DAO';
import { PrismaUserRepository } from 'src/infraestructure/repositories/prisma-user.repository';
import { RedisUserSessionsManagerService } from 'src/infraestructure/services/redis-user-sessions-manager.service';

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
      provide: USER_SESSIONS_MANAGER_SERVICE,
      useClass: RedisUserSessionsManagerService,
    },
    PrismaUserStatusDAO,
    PrismaMultifactorMethodsDAO,
    PrismaMultifactorStatusDAO,
  ],

  /**
   * Exported providers and tokens, making them available globally.
   */
  exports: [
    USER_REPOSITORY,
    USER_SESSIONS_MANAGER_SERVICE,
    PrismaUserStatusDAO,
    PrismaMultifactorMethodsDAO,
    PrismaMultifactorStatusDAO,
  ],
})
export class RepositoriesModule {}
