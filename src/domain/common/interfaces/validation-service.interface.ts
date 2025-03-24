/**
 * Symbols used for dependency injection and service identification.
 */
export const VALIDATION_SERVICE = Symbol('VALIDATION_SERVICE');
export const VALIDATORS = Symbol('VALIDATORS');

/**
 * Interface for a Validation Service responsible for handling validation logic.
 *
 * This interface defines methods to execute a validation process on a given request
 * and retrieve validated data in a type-safe manner.
 *
 * @template Request - The type of the request object to validate.
 */
export interface IValidationService<Request> {
  /**
   * Executes the validation guard on the provided request object.
   *
   * This method is responsible for running the validation logic and throwing
   * any relevant errors if the request does not meet validation criteria.
   *
   * @param request - The request object to validate.
   * @returns A promise that resolves when validation is successful, or throws an error if validation fails.
   *
   * @example
   * ```typescript
   * const validationService: IValidationService<MyRequestType> = ...;
   * await validationService.executeValidationGuard(myRequest);
   * ```
   */
  executeValidationGuard(request: Request): Promise<void>;

  /**
   * Retrieves the validated data after successful validation.
   *
   * This method ensures type-safe access to the validated data, which can be
   * used for further processing.
   *
   * @template Data - The type of the validated data.
   * @returns The validated data.
   *
   * @example
   * ```typescript
   * const validatedData = validationService.retrieveValidatedData<MyDataType>();
   * console.log(validatedData);
   * ```
   */
  retrieveValidatedData<Data>(): Data;
}
