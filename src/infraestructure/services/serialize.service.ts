import { Injectable } from '@nestjs/common';
import { ISerializeService } from 'src/domain/common/interfaces/serialize-service.interface';

/**
 * Service responsible for serializing and deserializing objects.
 * Implements the `ISerializeService` interface.
 */
@Injectable()
export class SerializeService implements ISerializeService {
  /**
   * Serializes a value into a JSON string.
   *
   * @typeParam T - The type of the value to serialize.
   * @param value - The value to be serialized.
   * @returns The JSON string representation of the value.
   */
  public serialize<T>(value: T): string {
    return JSON.stringify(value);
  }

  /**
   * Deserializes a JSON string into an object of the specified type.
   *
   * @typeParam T - The type of the resulting object.
   * @param value - The JSON string to deserialize.
   * @returns The deserialized object of type `T`.
   */
  public deserialize<T>(value: string): T {
    return JSON.parse(value) as T;
  }
}
