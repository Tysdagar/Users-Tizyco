import { DiscoveryModule } from '@nestjs/core';

import { ValidatorsProvider } from '../providers/validators.provider';
import { Module } from '@nestjs/common';
import {
  VALIDATION_SERVICE,
  VALIDATORS,
} from 'src/domain/common/interfaces/validation-service.interface';
import { ValidationService } from 'src/infraestructure/services/validation.service';

/**
 * The `ValidationModule` is responsible for registering and managing
 * validators in the application. It provides a centralized mechanism to
 * handle command and query validation.
 *
 * This module integrates the `ValidatorsProvider` to dynamically discover
 * and map validators to their respective commands or queries.
 */
@Module({
  imports: [
    /**
     * Import the `DiscoveryModule` to facilitate the dynamic discovery of
     * providers, enabling the `ValidatorsProvider` to map validators.
     */
    DiscoveryModule,
  ],
  providers: [
    // Command and query validators

    /**
     * The `ValidatorsProvider` is responsible for discovering and managing
     * the mapping between commands/queries and their validators.
     */
    ValidatorsProvider,

    /**
     * Factory provider for the `VALIDATORS` token.
     * This token provides the mapping of commands/queries to their validators.
     */
    {
      provide: VALIDATORS,
      useFactory: (validatorsProvider: ValidatorsProvider) => {
        return validatorsProvider.getValidators();
      },
      inject: [ValidatorsProvider],
    },

    /**
     * Provider for the `VALIDATION_SERVICE` token.
     * This token provides the `ValidationService` implementation.
     */
    {
      provide: VALIDATION_SERVICE,
      useClass: ValidationService,
    },
  ],
  /**
   * Export the `VALIDATION_SERVICE` token to make it available for
   * injection in other modules.
   */
  exports: [VALIDATION_SERVICE],
})
export class ValidationModule {}
