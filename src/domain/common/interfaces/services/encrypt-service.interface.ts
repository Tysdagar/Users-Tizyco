/**
 * Symbol used for identifying the Encrypt Service in dependency injection.
 */
export const ENCRYPT_SERVICE = Symbol('IEncryptService');

/**
 * Interface for an Encrypt Service, responsible for encryption and decryption of strings.
 */
export interface IEncryptService {
  /**
   * Encrypts a given string value.
   *
   * @param value - The plain text string to encrypt.
   * @returns The encrypted string.
   *
   * @example
   * ```typescript
   * const encryptedValue = encryptService.encrypt('SensitiveData');
   * console.log(encryptedValue); // Encrypted string
   * ```
   */
  encrypt(value: string): string;

  /**
   * Decrypts a given encrypted string value.
   *
   * @param value - The encrypted string to decrypt.
   * @returns The decrypted plain text string.
   *
   * @example
   * ```typescript
   * const decryptedValue = encryptService.decrypt(encryptedValue);
   * console.log(decryptedValue); // 'SensitiveData'
   * ```
   */
  decrypt(value: string): string;
}
