import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { hash } from 'bcrypt';
import { ConfigClient } from '../configuration/clients/config.client';
import { IPasswordSecurityService } from 'src/domain/contexts/users/interfaces/password-security.interface';

@Injectable()
export class PasswordSecurityService implements IPasswordSecurityService {
  /**
   * Secret key used for hashing passwords.
   * Retrieved from the configuration client.
   */
  private readonly SECRET: string;

  /**
   * Number of salt rounds used in the bcrypt hashing algorithm.
   */
  private readonly SALT_ROUNDS = 8;

  /**
   * Initializes the `PasswordService` with a configuration client.
   *
   * @param configClient - Client for accessing configuration values, such as the hash secret.
   */
  constructor(private readonly configClient: ConfigClient) {
    this.SECRET = configClient.getHashSecret();
  }

  /**
   * Hashes a value securely by appending a secret and using bcrypt.
   *
   * @param value - The plain text value to hash.
   * @returns A promise that resolves to the hashed value as a string.
   */
  public async secure(value: string): Promise<string> {
    return await hash(value + this.SECRET, this.SALT_ROUNDS);
  }

  /**
   * Verifies if a given plain text value matches a previously hashed value.
   *
   * @param valueHashed - The hashed value to compare against.
   * @param value - The plain text value to verify.
   * @returns A promise that resolves to `true` if the values match, or `false` otherwise.
   */
  public async check(value: string, valueHashed: string): Promise<boolean> {
    return await compare(value + this.SECRET, valueHashed);
  }
}
