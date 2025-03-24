/**
 * Symbol used for identifying the Serialize Service in dependency injection.
 */
export const SERIALIZE_SERVICE = Symbol('ISerializeService');

/**
 * Interface for a Serialize Service, responsible for serialization
 * and deserialization of objects.
 */
export interface ISerializeService {
  /**
   * Serializes a value into a JSON string.
   *
   * @param value - The value to serialize.
   * @returns The serialized string representation of the value.
   *
   * @example
   * ```typescript
   * const serialized = serializeService.serialize({ key: 'value' });
   * console.log(serialized); // '{"key":"value"}'
   * ```
   */
  serialize<T>(value: T): string;

  /**
   * Deserializes a JSON string into the specified type.
   *
   * @param value - The JSON string to deserialize.
   * @returns The deserialized object of the specified type.
   *
   * @example
   * ```typescript
   * const deserialized = serializeService.deserialize<{ key: string }>('{"key":"value"}');
   * console.log(deserialized.key); // 'value'
   * ```
   */
  deserialize<T>(value: string): T;
}
