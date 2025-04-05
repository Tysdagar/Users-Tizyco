import { Injectable } from '@nestjs/common';
import { UserStatus } from 'src/domain/contexts/users/aggregate/configuration/status.configuration';
import { ILoginAttemptService } from 'src/domain/contexts/users/interfaces/login-attempts.interface';
import { RedisClient } from '../configuration/clients/redis.client';

@Injectable()
export class LoginAttemptService implements ILoginAttemptService {
  private static readonly BLOCK_ATTEMPTS_KEY = 'block-attempts';
  private static readonly BLOCK_ATTEMPTS_VALUE = UserStatus.BLOCKED;
  private static readonly LOGIN_ATTEMPTS_KEY = 'login-attempts';
  private static readonly MAX_ATTEMPTS = 3;
  private static readonly MAX_TTL = 300;
  private static readonly MAX_BLOCK_TIME_TTL = 900;

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
      LoginAttemptService.MAX_TTL,
    );
  }

  public async hasExceededAttemptLimit(userId: string): Promise<boolean> {
    const attemptsKey = this.getUserAttemptsKey(userId);
    const attempts = await this.getKey(attemptsKey);
    const attemptsDeserialized = this.parseAttempts(attempts);

    return attemptsDeserialized === LoginAttemptService.MAX_ATTEMPTS;
  }

  public async blockUserTemporarily(userId: string): Promise<void> {
    const blockKey = this.getUserBlockedAttemptsKey(userId);
    const attemptsKey = this.getUserAttemptsKey(userId);

    await this.rd.execute.del(attemptsKey);

    await this.rd.execute.set(
      blockKey,
      LoginAttemptService.BLOCK_ATTEMPTS_VALUE,
      'EX',
      LoginAttemptService.MAX_BLOCK_TIME_TTL,
    );
  }

  public async isTemporarilyBlockedYet(userId: string): Promise<boolean> {
    const blockKey = this.getUserBlockedAttemptsKey(userId);
    const userAttemptsValue = await this.getKey(blockKey);
    return !!userAttemptsValue;
  }

  private getUserBlockedAttemptsKey(userId: string) {
    return `${LoginAttemptService.BLOCK_ATTEMPTS_KEY}:${userId}`;
  }

  private getUserAttemptsKey(userId: string) {
    return `${LoginAttemptService.LOGIN_ATTEMPTS_KEY}:${userId}`;
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
