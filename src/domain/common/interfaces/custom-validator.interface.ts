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

  /**
   * Sets the validated data for further processing.
   *
   * @typeParam Data - The type of the validated data.
   * @param data - The validated data to store.
   */
  setValidatedData<Data>(data: Data): void;

  /**
   * Retrieves the previously validated data.
   *
   * @typeParam Data - The type of the validated data.
   * @returns The validated data.
   */
  getValidatedData<Data>(): Data;
}
