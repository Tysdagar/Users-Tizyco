/**
 * Interface for a Value Object, representing an immutable concept with equality logic.
 * Provides methods for comparison, accessing the internal value, and updating the value.
 *
 * @template T - The type of the underlying value represented by the Value Object.
 */
export interface IValueObject<T> {
  /**
   * Compares the current Value Object with another to determine equality.
   *
   * @param other - Another Value Object to compare with.
   * @returns `true` if the two Value Objects are equal, otherwise `false`.
   *
   * @example
   * ```typescript
   * const value1: IValueObject<number> = new SomeValueObject(42);
   * const value2: IValueObject<number> = new SomeValueObject(42);
   * console.log(value1.equals(value2)); // true
   * ```
   */
  equals(other: IValueObject<T>): boolean;

  /**
   * Retrieves the internal value of the Value Object.
   *
   * @returns The internal value.
   *
   * @example
   * ```typescript
   * const value: IValueObject<string> = new SomeValueObject('example');
   * console.log(value.getValue); // 'example'
   * ```
   */
  get value(): T;
}
