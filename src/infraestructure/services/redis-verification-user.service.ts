import { IVerificationUserService } from 'src/domain/contexts/users/interfaces/verification-user.interface';
import { RedisClient } from '../configuration/clients/redis.client';
import { Injectable } from '@nestjs/common';
import { VerificationCodeGenerator } from 'src/domain/contexts/users/aggregate/configuration/verification-code.configuration';
import { VerificationUserData } from 'src/domain/contexts/users/types/user';

@Injectable()
export class RedisVerificationUserService implements IVerificationUserService {
  private readonly CONFIG = {
    KEY_PREFIX: 'verification',
    TTL_SECONDS: 3600,
  };

  constructor(private readonly redis: RedisClient) {}

  public async initializeUserVerification(userId: string): Promise<void> {
    const key = this.getKey(userId);
    const verificationCode = VerificationCodeGenerator.generate();

    console.log(verificationCode.code);

    await this.redis.execute.set(
      key,
      JSON.stringify(verificationCode),
      'EX',
      this.CONFIG.TTL_SECONDS,
    );
  }

  public async validateVerificationCode(
    userId: string,
    code: string,
  ): Promise<boolean> {
    try {
      const verificationData = await this.getVerificationUserData(userId);
      if (!verificationData) return false;

      const isCodeValid = verificationData.code === code;
      const isExpired = VerificationCodeGenerator.checkIsExpired(
        new Date(verificationData.expiresDate),
      );

      if (!isCodeValid || isExpired) {
        return false;
      }

      return true;
    } finally {
      await this.finishUserVerification(userId);
    }
  }

  public async finishUserVerification(userId: string): Promise<void> {
    const key = this.getKey(userId);
    await this.redis.execute.del(key);
  }

  public async isVerificationInProgress(userId: string): Promise<boolean> {
    const verificationData = await this.getVerificationUserData(userId);

    if (!verificationData) return false;

    const isExpired = VerificationCodeGenerator.checkIsExpired(
      new Date(verificationData.expiresDate),
    );

    if (isExpired) {
      await this.finishUserVerification(userId);
      return false;
    }

    return true;
  }

  private async getVerificationUserData(
    userId: string,
  ): Promise<VerificationUserData | null> {
    const key = this.getKey(userId);

    const data = await this.redis.execute.get(key);
    return data ? (JSON.parse(data) as VerificationUserData) : null;
  }

  private getKey(userId: string): string {
    return `${this.CONFIG.KEY_PREFIX}:${userId}`;
  }
}
