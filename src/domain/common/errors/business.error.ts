/**
 * Represents a business logic error, extending the `CustomError` class.
 * This error is used to handle scenarios where a specific business rule is violated.
 */
import { ErrorCodes } from './configuration/enums/error-codes.enum';
import { ErrorTypes } from './configuration/enums/error-types.enum';
import { CustomError } from './configuration/custom-error.config';

export class BusinessError extends CustomError {
  /**
   * Creates an instance of `BusinessError`.
   *
   * @param message - The error message describing the business rule violation.
   */
  constructor(message: string) {
    super(message, ErrorCodes.BAD_REQUEST, ErrorTypes.NO_VALID_OPERATION_ERROR);
  }

  /**
   * Converts the business error into a JSON object for serialization.
   *
   * @returns A JSON representation of the business error.
   */
  public override toJSON() {
    return {
      ...super.toJSON(),
    };
  }
}
