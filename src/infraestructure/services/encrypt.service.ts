import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';
import { IEncryptService } from 'src/domain/common/interfaces/encrypt-service.interface';
import { ConfigClient } from '../configuration/clients/config.client';

/**
 * Service for encryption and decryption of sensitive data.
 * Implements the `IEncryptService` interface.
 */
@Injectable()
export class EncryptService implements IEncryptService {
  /**
   * Encryption algorithm used for securing data.
   */
  private readonly algorithm = 'aes-256-cbc';

  /**
   * Initializes the `EncryptService` with a configuration client.
   *
   * @param configClient - Client for accessing configuration values, such as the encryption key.
   */
  constructor(private readonly configClient: ConfigClient) {}

  /**
   * Retrieves the encryption key from the configuration client and derives it using PBKDF2.
   *
   * @returns A buffer containing the derived encryption key.
   */
  private getKey(): Buffer {
    const key = this.configClient.getEncryptionKey();
    return pbkdf2Sync(key, 'salt', 100000, 32, 'sha256');
  }

  /**
   * Encrypts a string value using AES-256-CBC encryption.
   *
   * @param value - The plain text value to encrypt.
   * @returns The encrypted string in the format `{encrypted}:{iv}`, where `iv` is the initialization vector.
   */
  public encrypt(value: string): string {
    const iv = randomBytes(16); // Generate a 16-byte initialization vector.
    const key = this.getKey(); // Get the derived encryption key.
    const cipher = createCipheriv(this.algorithm, key, iv); // Create the cipher.
    let encrypted = cipher.update(value, 'utf8', 'hex'); // Encrypt the value.
    encrypted += cipher.final('hex'); // Finalize encryption.
    return `${encrypted}:${iv.toString('hex')}`; // Return encrypted value with IV.
  }

  /**
   * Decrypts an encrypted string using AES-256-CBC encryption.
   *
   * @param value - The encrypted string in the format `{encrypted}:{iv}`, where `iv` is the initialization vector.
   * @returns The decrypted plain text value.
   */
  public decrypt(value: string): string {
    const [encryptedValue, ivHex] = value.split(':'); // Split the encrypted value and IV.
    const ivBuffer = Buffer.from(ivHex, 'hex'); // Convert IV to buffer.
    const key = this.getKey(); // Get the derived encryption key.
    const decipher = createDecipheriv(this.algorithm, key, ivBuffer); // Create the decipher.
    let decrypted = decipher.update(encryptedValue, 'hex', 'utf8'); // Decrypt the value.
    decrypted += decipher.final('utf8'); // Finalize decryption.
    return decrypted; // Return the decrypted value.
  }
}
