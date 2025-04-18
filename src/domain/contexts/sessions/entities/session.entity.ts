import { randomUUID } from 'crypto';
import { ITokenManagerService } from '../interfaces/token-manager.interface';
import { UserAuthenticatedData } from '../../users/types/user';
import { type AccessTokenData, type SessionData } from '../types/session';
import { IFingerPrintService } from '../interfaces/device-info.interface';
import { USER_SESSIONS_EXCEPTION_FACTORY } from '../aggregate/exceptions/user-sessions-exception.factory';

export class Session {
  private static readonly ACCESS_TOKEN_MAX_TTL: number = 900; // 15 minutos
  private static readonly REFRESH_TOKEN_MAX_TTL: number = 604800; // 7 dias

  private constructor(
    private readonly sessionId: string,
    private readonly refreshToken: string,
    private readonly fingerPrint: string,
    private readonly accessToken: string | null,
    private readonly tokenType: string | null = 'Bearer',
    private readonly expiresIn: number = Session.REFRESH_TOKEN_MAX_TTL,
    private readonly createdAt: Date = new Date(),
  ) {
    this.sessionId = sessionId;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static build(session: SessionData) {
    return new Session(
      session.sessionId,
      session.refreshToken,
      session.fingerPrint,
      null,
      null,
      Session.REFRESH_TOKEN_MAX_TTL,
      new Date(),
    );
  }

  public static create(
    fingerPrintService: IFingerPrintService,
    tokenManagerService: ITokenManagerService,
    userData: UserAuthenticatedData,
  ) {
    const sessionId = randomUUID();
    const refreshToken = randomUUID();

    return new Session(
      sessionId,
      refreshToken,
      fingerPrintService.getEncrypted(),
      tokenManagerService.generate(
        sessionId,
        userData,
        Session.ACCESS_TOKEN_MAX_TTL,
      ),
    );
  }

  public validateRefreshToken(refreshToken: string) {
    return this.refreshToken === refreshToken;
  }

  get accessTokenData(): AccessTokenData {
    if (!this.accessToken) {
      throw USER_SESSIONS_EXCEPTION_FACTORY.throw('BAD_BUILDED_SESSION');
    }

    if (!this.tokenType) {
      throw USER_SESSIONS_EXCEPTION_FACTORY.throw('BAD_BUILDED_SESSION');
    }

    return {
      accessToken: this.accessToken,
      tokenType: this.tokenType,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn,
    };
  }

  get sessionData(): SessionData {
    return {
      sessionId: this.sessionId,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn,
      createdAt: this.createdAt,
      fingerPrint: this.fingerPrint,
    };
  }
}
