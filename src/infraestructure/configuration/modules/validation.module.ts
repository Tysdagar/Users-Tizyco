import { DiscoveryModule } from '@nestjs/core';

import { ValidatorsProvider } from '../providers/validators.provider';
import { Module } from '@nestjs/common';
import {
  VALIDATION_SERVICE,
  VALIDATORS,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { ValidationService } from 'src/infraestructure/helpers/validation.service';
import { RegisterUserValidator } from 'src/application/use-cases/register-user/register-user.validator';
import { RequestUserVerificationValidator } from 'src/application/use-cases/request-user-verification/request-user-verification.validator';
import { VerifyUserValidator } from 'src/application/use-cases/verify-user/verify-user.validator';
import { LoginUserValidator } from 'src/application/use-cases/login-user/login-user.validator';
import { RepositoriesModule } from './repositories.module';
import { LogoutUserValidator } from 'src/application/use-cases/logout-user/logout-user.validator';

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
    RepositoriesModule,
  ],
  providers: [
    // Request validators
    RegisterUserValidator,
    RequestUserVerificationValidator,
    VerifyUserValidator,
    LoginUserValidator,
    LogoutUserValidator,
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
