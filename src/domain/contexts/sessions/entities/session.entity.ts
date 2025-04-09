import { randomUUID } from 'crypto';
import { ITokenManagerService } from '../interfaces/token-manager.interface';
import { ExposedUserData } from '../../users/types/user';
import { type AccessTokenData, type SessionData } from '../types/session';
import { IFingerPrintService } from '../interfaces/device-info.interface';

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
    userData: ExposedUserData,
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

  get accessTokenData(): AccessTokenData {
    return {
      accessToken: this.accessToken!,
      tokenType: this.tokenType!,
      refreshToken: this.refreshToken,
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
