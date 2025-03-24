import { Global, Module } from '@nestjs/common';

/**
 * The `RepositoriesModule` is a global module responsible for providing
 * repository and DAO implementations for various application contexts.
 */
@Global()
@Module({
  /**
   * Services and implementations registered as providers.
   */
  providers: [],

  /**
   * Exported providers and tokens, making them available globally.
   */
  exports: [],
})
export class RepositoriesModule {}
