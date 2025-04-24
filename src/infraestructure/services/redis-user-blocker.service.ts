import { Injectable } from '@nestjs/common';
import { UserStatus } from 'src/domain/contexts/users/aggregate/configuration/status.configuration';
import { RedisClient } from '../configuration/clients/redis.client';
import { IUserBlockerService } from 'src/domain/contexts/users/interfaces/user-blocker.interface';

@Injectable()
export class RedisUserBlockerService implements IUserBlockerService {
  private static readonly BLOCK_ATTEMPTS_KEY = 'block-attempts';
  private static readonly BLOCK_ATTEMPTS_VALUE = UserStatus.BLOCKED;
  private static readonly MAX_BLOCK_TIME_TTL = 900;

  constructor(private readonly rd: RedisClient) {}

  public async blockUser(userId: string): Promise<void> {
    const blockKey = this.getUserBlockedAttemptsKey(userId);

    await this.rd.execute.set(
      blockKey,
      RedisUserBlockerService.BLOCK_ATTEMPTS_VALUE,
      'EX',
      RedisUserBlockerService.MAX_BLOCK_TIME_TTL,
    );
  }

  public async isTemporarilyBlockedYet(userId: string): Promise<boolean> {
    const blockKey = this.getUserBlockedAttemptsKey(userId);
    const userAttemptsValue = await this.getKey(blockKey);
    return !!userAttemptsValue;
  }

  private getUserBlockedAttemptsKey(userId: string) {
    return `${RedisUserBlockerService.BLOCK_ATTEMPTS_KEY}:${userId}`;
  }

  private async getKey(key: string) {
    return await this.rd.execute.get(key);
  }
}
