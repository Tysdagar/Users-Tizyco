/**
 * Represents a validation error that occurs when one or more validation rules fail.
 * Extends the `CustomError` class to include validation-specific details.
 */
import { Failure } from '../interfaces/custom-validator.interface';
import { ErrorCodes } from './configuration/enums/error-codes.enum';
import { ErrorTypes } from './configuration/enums/error-types.enum';
import { CustomError } from './configuration/custom-error.config';

export class ValidationError extends CustomError {
  /**
   * Stores the validation failures associated with this error.
   */
  private readonly validationFailures: Failure[];

  /**
   * Creates an instance of `ValidationError`.
   *
   * @param validationFailures - An array of `Failure` objects describing the validation errors.
   */
  constructor(validationFailures: Failure[]) {
    super(
      'Uno o varios errores de validación han ocurrido.',
      ErrorCodes.BAD_REQUEST,
      ErrorTypes.VALIDATION_ERROR,
    );
    this.validationFailures = validationFailures;
  }

  /**
   * Retrieves the list of validation failures.
   *
   * @returns An array of `Failure` objects.
   */
  private getValidationFailures(): Failure[] {
    return [...this.validationFailures];
  }

  /**
   * Converts the validation error into a JSON object for serialization.
   *
   * @returns A JSON representation of the validation error, including the validation failures.
   */
  public override toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.getValidationFailures(),
    };
  }
}
