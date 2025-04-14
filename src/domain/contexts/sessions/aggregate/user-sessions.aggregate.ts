import { AggregateRoot } from 'src/domain/common/abstract/aggregate-root.abstract';
import { Session } from '../entities/session.entity';
import { type UserAuthenticatedData } from '../../users/types/user';
import { IUserSessionsManagerService } from '../interfaces/session-manager.interface';
import { ITokenManagerService } from '../interfaces/token-manager.interface';
import { AccessTokenData } from '../types/session';
import { IFingerPrintService } from '../interfaces/device-info.interface';
import { USER_SESSIONS_EXCEPTION_FACTORY } from './exceptions/user-sessions-exception.factory';

export type Sessions = Map<string, Session>;

export class UserSessions extends AggregateRoot {
  private constructor(
    userId: string,
    private readonly _sessions: Sessions,
  ) {
    super(userId);
    this._sessions = _sessions;
  }

  public static build(userId: string, sessions: Sessions) {
    return new UserSessions(userId, sessions);
  }

  /**
   * Initializes a new session, revoking existing ones if necessary.
   */
  public async startSession(
    tokenManagerService: ITokenManagerService,
    sessionManagerService: IUserSessionsManagerService,
    fingerPrintService: IFingerPrintService,
    userData: UserAuthenticatedData,
  ): Promise<AccessTokenData> {
    const { fingerPrintHash, existingSession } =
      this.resolveSession(fingerPrintService);

    if (existingSession) {
      await this.revokeSession(sessionManagerService, fingerPrintHash);
    }

    const session = Session.create(
      fingerPrintService,
      tokenManagerService,
      userData,
    );

    await sessionManagerService.startSession(
      this.id,
      session.sessionData,
      fingerPrintHash,
    );

    return session.accessTokenData;
  }

  /**
   * Ends the current session for the user.
   */
  public async finishSession(
    sessionManagerService: IUserSessionsManagerService,
    fingerPrintService: IFingerPrintService,
  ) {
    const { fingerPrintHash, existingSession } =
      this.resolveSession(fingerPrintService);

    if (!existingSession) {
      throw USER_SESSIONS_EXCEPTION_FACTORY.throw('NOT_AUTHENTICATED');
    }

    await this.revokeSession(sessionManagerService, fingerPrintHash);
  }

  private resolveSession(fingerPrintService: IFingerPrintService) {
    const fingerPrintHash = fingerPrintService.getHash();

    const existingSession = this._sessions.get(fingerPrintHash);

    return { existingSession, fingerPrintHash };
  }

  /**
   * Revokes an existing session.
   */
  private async revokeSession(
    sessionManagerService: IUserSessionsManagerService,
    deviceHash: string,
  ) {
    this._sessions.delete(deviceHash);

    await sessionManagerService.revokeSession(this.id, deviceHash);
  }
}
