import { ConfiguredServicesCollection } from './validation-service.interface';

/**
 * Interface representing a validation failure.
 */
export interface Failure {
  /**
   * The name of the field where the validation error occurred.
   */
  field: string;

  /**
   * The error message describing the validation failure.
   */
  message: string;
}

/**
 * Interface defining a custom validator for request objects.
 * Provides methods for validating data, retrieving validation failures,
 * and managing validated data.
 */
export interface ICustomValidator<Request> {
  /**
   * Validates the given request object.
   *
   * @param request - The object to validate.
   * @returns A promise that resolves to `true` if validation succeeds, otherwise `false`.
   */
  validate(request: Request): Promise<boolean>;

  /**
   * Retrieves the list of validation failures.
   *
   * @returns An array of `Failure` objects.
   */
  getFailures(): Failure[];

  /**
   * Clears all validation failures.
   */
  cleanFailures(): void;

  saveConfiguredServices<TServices extends ConfiguredServicesCollection>(
    services: TServices,
  ): void;

  getConfiguredServices(): ConfiguredServicesCollection;
}
