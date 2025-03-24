/**
 * Abstract class representing a custom error structure.
 * Provides a standardized format for handling and serializing errors.
 */
import { ErrorCodes } from './enums/error-codes.enum';
import { ErrorTypes } from './enums/error-types.enum';

export abstract class CustomError extends Error {
  private readonly errorCode: ErrorCodes;
  private readonly errorType: ErrorTypes;
  private readonly timeStamp: Date;

  /**
   * Constructs a new instance of the `CustomError` class.
   *
   * @param message - The error message.
   * @param errorCode - The specific error code representing the error.
   * @param errorType - The type of error being represented.
   */
  constructor(message: string, errorCode: ErrorCodes, errorType: ErrorTypes) {
    super(message);
    this.errorCode = errorCode;
    this.errorType = errorType;
    this.timeStamp = new Date();
  }

  /**
   * Gets the specific error code for this error.
   *
   * @returns The error code.
   */
  public getErrorCode(): ErrorCodes {
    return this.errorCode;
  }

  /**
   * Gets the type of error represented by this instance.
   *
   * @returns The error type.
   */
  public getErrorType(): ErrorTypes {
    return this.errorType;
  }

  /**
   * Gets the timestamp indicating when the error occurred.
   *
   * @returns The timestamp of the error.
   */
  public getTimeStamp(): Date {
    return this.timeStamp;
  }

  /**
   * Converts the error instance into a JSON object for serialization.
   *
   * @returns A JSON representation of the error.
   */
  public toJSON() {
    return {
      errorCode: this.errorCode,
      errorType: this.errorType,
      message: this.message,
      timestamp: this.timeStamp,
    };
  }
}
