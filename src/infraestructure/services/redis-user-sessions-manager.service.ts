import { Injectable } from '@nestjs/common';
import { IUserSessionsManagerService } from 'src/domain/contexts/sessions/interfaces/session-manager.interface';
import { type SessionData } from 'src/domain/contexts/sessions/types/session';
import { RedisClient } from '../configuration/clients/redis.client';
import { DataTransformationService } from '../helpers/data-transform.service';
import { Sessions } from 'src/domain/contexts/sessions/aggregate/user-sessions.aggregate';
import { Session } from 'src/domain/contexts/sessions/entities/session.entity';

@Injectable()
export class RedisUserSessionsManagerService
  implements IUserSessionsManagerService
{
  private static readonly SESSIONS_HASH = 'sessions:user';

  constructor(
    private readonly rd: RedisClient,
    private readonly dataTransformationService: DataTransformationService,
  ) {}

  public async startSession(
    userId: string,
    sessionData: SessionData,
    fingerPrintHash: string,
  ): Promise<void> {
    const userSessionsKey = this.getUserSessionsSetKey(userId);

    await this.rd.execute.hset(
      userSessionsKey,
      fingerPrintHash,
      this.dataTransformationService.transformToSecureFormat(sessionData),
    );
  }

  public async revokeSession(
    userId: string,
    fingerPrintHash: string,
  ): Promise<void> {
    const userSessionsKey = this.getUserSessionsSetKey(userId);

    await this.rd.execute.hdel(userSessionsKey, fingerPrintHash);
  }

  public async getAll(userId: string): Promise<Sessions> {
    const sessions = new Map() as Sessions;

    const savedSessions = await this.rd.execute.hgetall(
      this.getUserSessionsSetKey(userId),
    );

    const sessionsFormated = Object.entries(savedSessions);

    if (sessionsFormated.length > 0) {
      sessionsFormated.forEach(([fingerPrintHash, sessionHash]) => {
        const sessionDecrypted =
          this.dataTransformationService.transformFromSecureFormat<SessionData>(
            sessionHash,
          );

        const session = Session.build(sessionDecrypted);

        sessions.set(fingerPrintHash, session);
      });
    }

    return sessions;
  }

  private getUserSessionsSetKey(userId: string): string {
    return `${RedisUserSessionsManagerService.SESSIONS_HASH}:${userId}`;
  }
}
