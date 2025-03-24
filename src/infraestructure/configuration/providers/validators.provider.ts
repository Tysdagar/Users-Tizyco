import { Injectable, OnModuleInit, Type } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { Command, Query } from '@nestjs/cqrs';
import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { CUSTOM_VALIDATOR_KEY } from 'src/application/decorators/request-validator.decorator';

/**
 * Service responsible for discovering and managing custom validators.
 *
 * This service uses NestJS's `DiscoveryService` and `Reflector` to dynamically
 * discover custom validators associated with specific commands or queries.
 *
 * The `ValidatorsProvider` implements the `OnModuleInit` lifecycle hook to
 * perform the discovery process during the module initialization phase.
 */
@Injectable()
export class ValidatorsProvider implements OnModuleInit {
  /**
   * Stores the mapping between commands/queries and their associated custom validators.
   */
  private validators = new Map<
    Type<Command<any> | Query<any>>,
    Type<CustomValidator<Command<any> | Query<any>>>
  >();

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Initializes the service during the module's lifecycle.
   *
   * This method discovers all providers in the application, checks for custom
   * validators using a reflection key (`CUSTOM_VALIDATOR_KEY`), and maps them
   * to their corresponding commands or queries.
   */
  onModuleInit() {
    const providers = this.discoveryService.getProviders();

    providers.forEach((provider) => {
      if (!provider.metatype) return;

      const command = this.reflector.get<Type<Command<any> | Query<any>>>(
        CUSTOM_VALIDATOR_KEY,
        provider.metatype,
      );

      if (command) {
        const validator = provider.metatype as Type<
          CustomValidator<Command<any> | Query<any>>
        >;

        this.validators.set(command, validator);
      }
    });
  }

  /**
   * Retrieves the mapping of commands/queries to their custom validators.
   *
   * @returns A `Map` where the key is a command/query type and the value
   * is the associated custom validator type.
   */
  getValidators(): Map<
    Type<Command<any> | Query<any>>,
    Type<CustomValidator<Command<any> | Query<any>>>
  > {
    return this.validators;
  }
}
