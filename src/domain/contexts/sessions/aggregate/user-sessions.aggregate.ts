import { AggregateRoot } from 'src/domain/common/abstract/aggregate-root.abstract';
import { Session } from '../entities/session.entity';
import { type UserAuthenticatedData } from '../../users/types/user';
import { IUserSessionsManagerService } from '../interfaces/session-manager.interface';
import { ITokenManagerService } from '../interfaces/token-manager.interface';
import { AccessTokenData } from '../types/session';
import { IFingerPrintService } from '../interfaces/device-info.interface';
import { USER_SESSIONS_EXCEPTION_FACTORY } from './exceptions/user-sessions-exception.factory';

export type Sessions = Map<string, Session>;

/**
 * Class managing user sessions.
 * Extends AggregateRoot to encapsulate session-related behavior.
 */
export class UserSessions extends AggregateRoot {
  /**
   * A map of active sessions, keyed by fingerprint hash.
   */
  private readonly activeSessions: Sessions;

  /**
   * Private constructor. Use the `build` method to create an instance.
   * @param {string} userId - Unique identifier for the user.
   * @param {Sessions} activeSessions - Map of active sessions.
   */
  private constructor(userId: string, activeSessions: Sessions) {
    super(userId);
    this.activeSessions = activeSessions;
  }

  /**
   * Factory method to create a UserSessions instance.
   * @param {string} userId - Unique identifier for the user.
   * @param {Sessions} activeSessions - Map of active sessions.
   * @returns {UserSessions} A new UserSessions instance.
   */
  public static build(userId: string, activeSessions: Sessions): UserSessions {
    return new UserSessions(userId, activeSessions);
  }

  /**
   * Starts a new session, revoking any existing session with the same fingerprint hash.
   * @param {ITokenManagerService} tokenManager - Token management service.
   * @param {IUserSessionsManagerService} sessionManager - Session management service.
   * @param {IFingerPrintService} fingerPrintService - Fingerprint hash generator.
   * @param {UserAuthenticatedData} userData - Authenticated user data.
   * @returns {Promise<AccessTokenData>} The new session's access token data.
   */
  public async startSession(
    tokenManager: ITokenManagerService,
    sessionManager: IUserSessionsManagerService,
    fingerPrintService: IFingerPrintService,
    userData: UserAuthenticatedData,
  ): Promise<AccessTokenData> {
    const { fingerPrintHash, existingSession } =
      this.getSessionByFingerPrint(fingerPrintService);

    if (existingSession) {
      await this.revokeSession(sessionManager, fingerPrintHash);
    }

    return await this.createSession(
      tokenManager,
      sessionManager,
      fingerPrintService,
      userData,
      fingerPrintHash,
    );
  }

  /**
   * Ends an existing session for the user.
   * @param {IUserSessionsManagerService} sessionManager - Session management service.
   * @param {IFingerPrintService} fingerPrintService - Fingerprint hash generator.
   * @throws If the session does not exist.
   */
  public async finishSession(
    sessionManager: IUserSessionsManagerService,
    fingerPrintService: IFingerPrintService,
  ): Promise<void> {
    const { fingerPrintHash, existingSession } =
      this.getSessionByFingerPrint(fingerPrintService);

    if (!existingSession) {
      throw USER_SESSIONS_EXCEPTION_FACTORY.new('SESSION_CLOSED');
    }

    await this.revokeSession(sessionManager, fingerPrintHash);
  }

  /**
   * Refreshes an existing session by validating the refresh token.
   * @param {ITokenManagerService} tokenManager - Token management service.
   * @param {IUserSessionsManagerService} sessionManager - Session management service.
   * @param {IFingerPrintService} fingerPrintService - Fingerprint hash generator.
   * @param {UserAuthenticatedData} userData - Authenticated user data.
   * @param {string} refreshToken - Refresh token to validate.
   * @returns {Promise<AccessTokenData>} The refreshed session's access token data.
   * @throws If the session does not exist or the refresh token is invalid.
   */
  public async refreshSession(
    tokenManager: ITokenManagerService,
    sessionManager: IUserSessionsManagerService,
    fingerPrintService: IFingerPrintService,
    userData: UserAuthenticatedData,
    refreshToken: string,
  ): Promise<AccessTokenData> {
    const { fingerPrintHash, existingSession } =
      this.getSessionByFingerPrint(fingerPrintService);

    if (!existingSession) {
      throw USER_SESSIONS_EXCEPTION_FACTORY.new('SESSION_CLOSED');
    }

    if (!existingSession.validateRefreshToken(refreshToken)) {
      await this.revokeSession(sessionManager, fingerPrintHash);
      throw USER_SESSIONS_EXCEPTION_FACTORY.new('INVALID_REFRESH_TOKEN');
    }

    await this.revokeSession(sessionManager, fingerPrintHash);
    return await this.createSession(
      tokenManager,
      sessionManager,
      fingerPrintService,
      userData,
      fingerPrintHash,
    );
  }

  /**
   * Retrieves the session for the current fingerprint hash.
   * @param {IFingerPrintService} fingerPrintService - Fingerprint hash generator.
   * @returns {{ existingSession: Session | undefined, fingerPrintHash: string }} The session and fingerprint hash.
   */
  private getSessionByFingerPrint(fingerPrintService: IFingerPrintService): {
    existingSession: Session | undefined;
    fingerPrintHash: string;
  } {
    const fingerPrintHash = fingerPrintService.getHash();
    return {
      fingerPrintHash,
      existingSession: this.activeSessions.get(fingerPrintHash),
    };
  }

  /**
   * Revokes a session by removing it from active sessions and notifying the session manager.
   * @param {IUserSessionsManagerService} sessionManager - Session management service.
   * @param {string} deviceHash - Fingerprint hash of the session to revoke.
   */
  private async revokeSession(
    sessionManager: IUserSessionsManagerService,
    deviceHash: string,
  ): Promise<void> {
    this.activeSessions.delete(deviceHash);
    await sessionManager.revokeSession(this.id, deviceHash);
  }

  /**
   * Creates a new session and registers it with the session manager.
   * @param {ITokenManagerService} tokenManager - Token management service.
   * @param {IUserSessionsManagerService} sessionManager - Session management service.
   * @param {IFingerPrintService} fingerPrintService - Fingerprint hash generator.
   * @param {UserAuthenticatedData} userData - Authenticated user data.
   * @param {string} fingerPrintHash - Fingerprint hash of the new session.
   * @returns {Promise<AccessTokenData>} The new session's access token data.
   */
  private async createSession(
    tokenManager: ITokenManagerService,
    sessionManager: IUserSessionsManagerService,
    fingerPrintService: IFingerPrintService,
    userData: UserAuthenticatedData,
    fingerPrintHash: string,
  ): Promise<AccessTokenData> {
    const session = Session.create(fingerPrintService, tokenManager, userData);

    await sessionManager.startSession(
      this.id,
      session.sessionData,
      fingerPrintHash,
    );

    return session.accessTokenData;
  }
}
