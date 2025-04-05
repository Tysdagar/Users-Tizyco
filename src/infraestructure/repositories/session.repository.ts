import { Injectable } from '@nestjs/common';
import { ISessionRepository } from 'src/domain/contexts/sessions/repositories/session.repository';
import { type SessionData } from 'src/domain/contexts/sessions/types/session';

@Injectable()
export class SessionRepository implements ISessionRepository {
  public save(sessionData: SessionData): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
