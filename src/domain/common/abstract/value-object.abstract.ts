import { ValidationException } from '../errors/validation.exception';
import { Failure } from '../interfaces/services/custom-validator.interface';
import { IValueObject } from '../interfaces/concepts/value-object.interface';

/**
 * Abstract base class for Value Objects in a Domain-Driven Design context.
 * Provides common functionality for comparing and managing immutable values.
 *
 * @template T - The type of the value stored in the Value Object.
 */
export abstract class ValueObject<T> implements IValueObject<T> {
  private readonly _value: T;

  private readonly failures: Failure[] = [];

  constructor(value: T) {
    if (!this.validate(value)) {
      throw new ValidationException(this.failures);
    }

    this._value = value;
  }

  /**
   * Abstract method for validating the value.
   * Must be implemented by concrete Value Object classes.
   */
  abstract validate(value: T): boolean;

  /**
   * Returns the value stored in the Value Object.
   */
  get value(): T {
    return this._value;
  }

  /**
   * Compares the current Value Object with another to determine equality.
   * @param other - The Value Object to compare.
   */
  public equals(other: IValueObject<T>): boolean {
    return (
      other instanceof ValueObject &&
      this.constructor === other.constructor &&
      this._value === other.value
    );
  }

  /**
   * Checks if there are multiple validation errors.
   */
  protected hasNoErrors(): boolean {
    return this.failures.length === 0;
  }

  /**
   * Adds a validation error.
   * @param field - The field where the error occurred.
   * @param message - The error message.
   */
  protected addError(field: string, message: string): void {
    this.failures.push({ field, message });
  }
}
