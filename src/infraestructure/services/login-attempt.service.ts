/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { ILoginAttemptService } from 'src/domain/contexts/interfaces/login-attempts.interface';

@Injectable()
export class LoginAttemptService implements ILoginAttemptService {
  resetAttempts(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  recordFailedAttempt(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  hasExceededAttemptLimit(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  blockUserTemporarily(userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  isTemporalyBlockedYet(userId: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
