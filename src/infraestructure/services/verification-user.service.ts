import { IVerificationUserService } from 'src/domain/contexts/interfaces/verification-account.interface';
import { VerificationUserData } from 'src/domain/contexts/types/user';
import { RedisClient } from '../configuration/clients/redis.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationUserService implements IVerificationUserService {
  private readonly VERIFICATION_KEY = 'verification';
  private readonly MAX_TTL = 3600;

  constructor(private readonly rd: RedisClient) {}

  public async saveVerificationData(data: VerificationUserData): Promise<void> {
    const verificationDataKey = `${this.VERIFICATION_KEY}:${data.userId}`;

    const verificationDataValue = JSON.stringify({
      code: data.code,
      expiresAt: data.expiresDate.toISOString(),
    });

    await this.rd.execute.set(
      verificationDataKey,
      verificationDataValue,
      'EX',
      this.MAX_TTL,
    );
  }

  public async getVerificationCode(
    userId: string,
  ): Promise<VerificationUserData | null> {
    const verificationDataKey = `${this.VERIFICATION_KEY}:${userId}`;

    const verificationData = await this.rd.execute.get(verificationDataKey);

    if (!verificationData) {
      return null;
    }

    const parsedData = JSON.parse(verificationData) as {
      code: string;
      expiresAt: string;
    };

    const expiresDate = new Date(parsedData.expiresAt);

    return {
      userId,
      code: parsedData.code,
      expiresDate,
    };
  }

  public async removeVerificationData(userId: string): Promise<void> {
    const verificationDataKey = `${this.VERIFICATION_KEY}:${userId}`;

    await this.rd.execute.del(verificationDataKey);
  }
}
