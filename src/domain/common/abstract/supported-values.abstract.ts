/**
 * Utility class for working with enum-like objects and their supported values.
 * Provides methods to check if a value is supported and retrieve the supported values.
 */
export abstract class SupportedValuesUtil {
  /**
   * Checks if a given value is supported by the provided enum-like object.
   *
   * @param obj - An enum-like object containing the supported values.
   * @param value - The value to check.
   * @returns `true` if the value is supported, otherwise `false`.
   *
   * @example
   * ```typescript
   * enum Colors {
   *   Red = 'red',
   *   Blue = 'blue',
   * }
   *
   * const isSupported = SupportedValuesUtil.isSupportedValue(Colors, 'red');
   * console.log(isSupported); // true
   * ```
   */
  protected static isSupportedValue<T extends EnumLike>(
    obj: T,
    value: string,
  ): boolean {
    const validValues = getSupportedValues(obj).map((v) =>
      v.toString().toLowerCase(),
    );
    return validValues.includes(value.toLowerCase());
  }

  /**
   * Retrieves all supported values from the provided enum-like object.
   *
   * @param obj - An enum-like object containing the supported values.
   * @returns An array of supported values.
   *
   * @example
   * ```typescript
   * enum Colors {
   *   Red = 'red',
   *   Blue = 'blue',
   * }
   *
   * const supportedValues = SupportedValuesUtil.getSupportedValues(Colors);
   * console.log(supportedValues); // ['red', 'blue']
   * ```
   */
  protected static getSupportedValues<T extends EnumLike>(
    obj: T,
  ): T[keyof T][] {
    return getSupportedValues(obj);
  }
}

/**
 * Retrieves the supported values from an object.
 *
 * @template T - The type of the object containing the values.
 * @param obj - The object to retrieve values from.
 * @returns An array of values from the object.
 */
type SupportedValues<T> = T[keyof T][];
type EnumLike = { [key: string]: string | number };

const getSupportedValues = <T extends object>(obj: T): SupportedValues<T> => {
  return Object.values(obj) as SupportedValues<T>;
};
