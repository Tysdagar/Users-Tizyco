import { IValueObject } from '../interfaces/value-object.interface';

/**
 * Abstract base class for Value Objects in a Domain-Driven Design context.
 * Provides common functionality for comparing and managing immutable values.
 *
 * @template T - The type of the value stored in the Value Object.
 */
export abstract class ValueObject<T> implements IValueObject<T> {
  /**
   * The underlying value of the Value Object.
   */
  private _value: T;

  /**
   * Compares this Value Object to another to check for equality.
   *
   * @param other - Another Value Object to compare with.
   * @returns `true` if the Value Objects are equal, otherwise `false`.
   */
  public equals(other: IValueObject<T>): boolean {
    if (!(other instanceof ValueObject)) {
      return false;
    }

    return JSON.stringify(this) === JSON.stringify(other);
  }

  /**
   * Retrieves the underlying value of the Value Object.
   *
   * @returns The value of the Value Object.
   */
  public get value(): T {
    return this._value;
  }

  /**
   * Sets the underlying value of the Value Object.
   *
   * @param value - The new value to set.
   */
  public setValue(value: T): void {
    this._value = value;
  }
}
