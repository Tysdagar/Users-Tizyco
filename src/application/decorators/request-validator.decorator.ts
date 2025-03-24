import { SetMetadata } from '@nestjs/common';
import { Command, Query } from '@nestjs/cqrs';
import { CustomValidator } from '../abstract/custom-validator.abstract';

/**
 * Custom metadata key used to associate a validator with a specific request type.
 */
export const CUSTOM_VALIDATOR_KEY = 'CUSTOM_VALIDATOR_KEY';

/**
 * Decorator to associate a custom validator with a specific request type.
 *
 * This decorator is applied to classes that extend `CustomValidator` and associates
 * them with a specific command or query type. It utilizes NestJS `SetMetadata` to
 * attach the request type to the class metadata.
 *
 * @template T - The type of the command or query.
 * @param requestType - The class type of the command or query the validator is for.
 * @returns A decorator function for the custom validator class.
 *
 * @example
 * ```typescript
 * @RequestValidator(MyCommand)
 * export class MyCommandValidator extends CustomValidator<MyCommand> {
 *   validate(command: MyCommand): void {
 *     // Custom validation logic here
 *   }
 * }
 * ```
 */
export function RequestValidator<T extends Command<any> | Query<any>>(
  requestType: new (...args: any[]) => T,
) {
  return function <U extends CustomValidator<T>>(target: {
    new (...args: any[]): U;
  }) {
    SetMetadata(CUSTOM_VALIDATOR_KEY, requestType)(target);
  };
}
