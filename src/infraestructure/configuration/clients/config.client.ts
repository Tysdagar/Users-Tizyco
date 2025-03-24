import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Service for accessing application configuration variables.
 */
@Injectable()
export class ConfigClient {
  /**
   * Initializes the ConfigClient service.
   * @param {ConfigService} configService - Service to retrieve configuration variables.
   */
  constructor(private configService: ConfigService) {}

  /**
   * Retrieves the application port.
   * @returns {string} The application port.
   */
  public getAppPort(): string {
    return this.configService.get<string>('APP_PORT')!;
  }

  /**
   * Retrieves the hash secret key.
   * @returns {string} The hash secret key.
   */
  public getHashSecret(): string {
    return this.configService.get<string>('HASH_SECRET')!;
  }

  /**
   * Retrieves the encryption key.
   * @returns {string} The encryption key.
   */
  public getEncryptionKey(): string {
    return this.configService.get<string>('ENCRYPTION_KEY')!;
  }

  /**
   * Retrieves the Redis host address.
   * @returns {string} The Redis host.
   */
  public getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST')!;
  }

  /**
   * Retrieves the Redis port.
   * @returns {number} The Redis port.
   */
  public getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT')!;
  }

  /**
   * Retrieves the Redis password.
   * @returns {string} The Redis password.
   */
  public getRedisPassword(): string {
    return this.configService.get<string>('REDIS_PASS')!;
  }
}
