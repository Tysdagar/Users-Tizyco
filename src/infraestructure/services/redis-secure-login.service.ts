import { Injectable } from '@nestjs/common';
import { ISecureLoginService } from 'src/domain/contexts/users/interfaces/secure-login.interface';
import { RedisClient } from '../configuration/clients/redis.client';

@Injectable()
export class RedisLoginAttemptService implements ISecureLoginService {
  private static readonly LOGIN_ATTEMPTS_KEY = 'login-attempts';
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly MAX_TTL = 300;

  constructor(private readonly rd: RedisClient) {}

  public async resetAttempts(userId: string): Promise<void> {
    const attemptsKey = this.getUserAttemptsKey(userId);
    await this.rd.execute.del(attemptsKey);
  }

  public async recordFailedAttempt(userId: string): Promise<void> {
    const attemptsKey = this.getUserAttemptsKey(userId);
    const attempts = await this.getKey(attemptsKey);

    const currentAttempts = this.parseAttempts(attempts);

    const attemptsDataValue = JSON.stringify({
      attempt: currentAttempts + 1,
    });

    await this.rd.execute.set(
      attemptsKey,
      attemptsDataValue,
      'EX',
      RedisLoginAttemptService.MAX_TTL,
    );
  }

  public async hasExceededAttemptLimit(userId: string): Promise<boolean> {
    const attemptsKey = this.getUserAttemptsKey(userId);
    const attempts = await this.getKey(attemptsKey);
    const attemptsDeserialized = this.parseAttempts(attempts);

    return attemptsDeserialized === RedisLoginAttemptService.MAX_ATTEMPTS;
  }

  private getUserAttemptsKey(userId: string) {
    return `${RedisLoginAttemptService.LOGIN_ATTEMPTS_KEY}:${userId}`;
  }

  private async getKey(key: string) {
    return await this.rd.execute.get(key);
  }

  private parseAttempts(attempts: string | null): number {
    if (!attempts) return 0;
    try {
      return (JSON.parse(attempts) as { attempt: number }).attempt ?? 0;
    } catch {
      return 0;
    }
  }
}
