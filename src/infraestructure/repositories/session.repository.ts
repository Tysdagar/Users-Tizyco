import { Injectable } from '@nestjs/common';
import { ISessionRepository } from 'src/domain/contexts/sessions/repositories/session.repository';
import { type SessionData } from 'src/domain/contexts/sessions/types/session';
import { RedisClient } from '../configuration/clients/redis.client';
import { RequestContextClient } from '../configuration/clients/request-context.client';
import { createHash } from 'crypto';
import { DataTransformationService } from '../helpers/data-transform.service';

@Injectable()
export class SessionRepository implements ISessionRepository {
  private static readonly SESSION_KEY = 'session';
  private static readonly SESSIONS_SET = 'sessions:user';
  private static readonly DEVICE_USER_KEY = 'device-user';

  constructor(
    private readonly rd: RedisClient,
    private readonly dataTransformationService: DataTransformationService,
  ) {}

  public async save(userId: string, sessionData: SessionData): Promise<void> {
    const { sessionId, expiresIn } = sessionData;

    const sessionKey = this.getSessionKey(sessionId);
    const deviceUserKey = this.getDeviceUserKey(userId);
    const existingSessionId = await this.getExistingSessionId(deviceUserKey);

    if (existingSessionId) {
      await this.revokeSession(userId, existingSessionId, deviceUserKey);
    }

    await this.saveDeviceSessionLink(deviceUserKey, sessionId, expiresIn);
    await this.saveSessionData(sessionKey, sessionData, expiresIn);
    await this.addSessionToUserSet(userId, sessionId);
  }

  private async revokeSession(
    userId: string,
    sessionId: string,
    deviceUserKey: string,
  ): Promise<void> {
    await this.rd.execute.del(this.getSessionKey(sessionId));
    await this.rd.execute.srem(this.getUserSessionsSetKey(userId), sessionId);
    await this.rd.execute.del(deviceUserKey);
  }

  private async saveDeviceSessionLink(
    deviceUserKey: string,
    sessionId: string,
    expiresIn: number,
  ): Promise<void> {
    await this.rd.execute.set(deviceUserKey, sessionId, 'EX', expiresIn);
  }

  private async saveSessionData(
    sessionKey: string,
    sessionData: SessionData,
    expiresIn: number,
  ): Promise<void> {
    await this.rd.execute.set(
      sessionKey,
      this.dataTransformationService.transformToSecureFormat(sessionData),
      'EX',
      expiresIn,
    );
  }

  private async addSessionToUserSet(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    await this.rd.execute.sadd(this.getUserSessionsSetKey(userId), sessionId);
  }

  private async getExistingSessionId(
    deviceUserKey: string,
  ): Promise<string | null> {
    return this.rd.execute.get(deviceUserKey);
  }

  private getDeviceUserKey(userId: string): string {
    const hash = this.buildDeviceInfoHash();
    return `${SessionRepository.DEVICE_USER_KEY}:${userId}:${hash}`;
  }

  private buildDeviceInfoHash(): string {
    const deviceInfo = {
      ip: RequestContextClient.get<string>('ip') ?? '',
      device: RequestContextClient.get<string>('device') ?? '',
      userAgent: RequestContextClient.get<string>('userAgent') ?? '',
    };

    const raw = Object.values(deviceInfo).join(';');
    return createHash('sha256').update(raw).digest('hex');
  }

  private getSessionKey(sessionId: string): string {
    return `${SessionRepository.SESSION_KEY}:${sessionId}`;
  }

  private getUserSessionsSetKey(userId: string): string {
    return `${SessionRepository.SESSIONS_SET}:${userId}`;
  }
}
