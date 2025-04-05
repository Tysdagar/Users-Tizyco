import {
  Failure,
  ICustomValidator,
} from 'src/domain/common/interfaces/services/custom-validator.interface';

/**
 * Abstract base class for custom validators.
 *
 * This class provides a structure for implementing validation logic
 * with support for failure registration, validation state management,
 * and storage of validated data.
 *
 * @template Request - The type of the request to validate.
 */
export abstract class CustomValidator<Request>
  implements ICustomValidator<Request>
{
  /**
   * List of validation failures.
   */
  protected _failures: Failure[] = [];

  /**
   * Stores the validated data.
   */
  protected _validatedData: any;

  constructor() {}

  /**
   * Abstract method to be implemented by subclasses for performing validation.
   *
   * @param request - The request object to validate.
   * @returns A promise that resolves to a boolean indicating validation success.
   */
  public abstract validate(request: Request): Promise<boolean>;

  /**
   * Returns the list of validation failures.
   *
   * @returns An array of `Failure` objects containing field names and error messages.
   */
  public getFailures(): Failure[] {
    return this._failures;
  }

  /**
   * Registers a validation failure for a specific field with a message.
   *
   * @param field - The name of the field that failed validation.
   * @param message - A message describing the validation failure.
   */
  protected registerFailure(field: string, message: string): void {
    this._failures.push({ field, message });
  }

  /**
   * Checks if there are any registered validation failures.
   *
   * @returns `true` if there are failures, otherwise `false`.
   */
  protected checkValidation(): boolean {
    return this._failures.length > 0;
  }

  /**
   * Determines whether to stop validation after a failure.
   *
   * @returns `true` to indicate validation should stop on failure.
   */
  private stopValidationOnFailure(): boolean {
    return true;
  }

  /**
   * Registers a validation failure and optionally stops further validation.
   *
   * @param field - The name of the field that failed validation.
   * @param message - A message describing the validation failure.
   * @returns A boolean indicating whether to stop validation.
   */
  protected failValidation(field: string, message: string): boolean {
    this.registerFailure(field, message);
    return this.stopValidationOnFailure();
  }

  /**
   * Clears all registered validation failures.
   */
  public cleanFailures(): void {
    this._failures = [];
  }

  /**
   * Sets the validated data after successful validation.
   *
   * @template Data - The type of the validated data.
   * @param data - The data to store as validated.
   */
  public saveValidatedData<Data>(data: Data): void {
    this._validatedData = data;
  }

  /**
   * Retrieves the validated data.
   *
   * @template Data - The expected type of the validated data.
   * @returns The validated data cast to the specified type.
   */
  public getValidatedData<Data>(): Data {
    return this._validatedData as Data;
  }
}
