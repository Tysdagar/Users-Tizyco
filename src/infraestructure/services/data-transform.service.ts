import {
  ISerializeService,
  SERIALIZE_SERVICE,
} from 'src/domain/common/interfaces/serialize-service.interface';
import {
  ENCRYPT_SERVICE,
  IEncryptService,
} from 'src/domain/common/interfaces/encrypt-service.interface';
import { Inject, Injectable } from '@nestjs/common';

/**
 * Service responsible for data transformation, including serialization and encryption.
 */
@Injectable()
export class DataTransformationService {
  /**
   * Constructs a new instance of `DataTransformationService`.
   *
   * @param serializeService - Service used for serializing and deserializing data.
   * @param encryptService - Service used for encrypting and decrypting data.
   */
  constructor(
    @Inject(SERIALIZE_SERVICE)
    private readonly serializeService: ISerializeService,
    @Inject(ENCRYPT_SERVICE)
    private readonly encryptService: IEncryptService,
  ) {}

  /**
   * Transforms data into a secure format by serializing and encrypting it.
   *
   * @typeParam Data - The type of the data to be transformed.
   * @param data - The original data to be secured.
   * @returns A string containing the serialized and encrypted representation of the input data.
   */
  public transformToSecureFormat<Data>(data: Data): string {
    const serializedData = this.serializeService.serialize(data); // Serialize the data.
    return this.encryptService.encrypt(serializedData); // Encrypt the serialized data.
  }

  /**
   * Transforms data from a secure format by decrypting and deserializing it.
   *
   * @typeParam Data - The type of the data to be transformed.
   * @param dataEncrypted - The encrypted and serialized string representation of the data.
   * @returns The original data reconstructed from the secure format.
   */
  public transformFromSecureFormat<Data>(dataEncrypted: string): Data {
    const decryptedData = this.encryptService.decrypt(dataEncrypted); // Decrypt the data.
    return this.serializeService.deserialize<Data>(decryptedData); // Deserialize the decrypted data.
  }
}
