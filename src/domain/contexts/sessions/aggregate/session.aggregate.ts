import { randomUUID } from 'crypto';
import { ITokenManagerService } from '../interfaces/token-manager.interface';
import { ExposedUserData } from '../../users/types/user';
import { type AccessTokenData, type SessionData } from '../types/session';
import { AggregateRoot } from 'src/domain/common/abstract/aggregate-root.abstract';

export class Session extends AggregateRoot {
  private static readonly ACCESS_TOKEN_MAX_TTL: number = 900; // 15 minutos
  private static readonly REFRESH_TOKEN_MAX_TTL: number = 604800; // 7 dias

  private constructor(
    sessionId: string,
    private readonly accessToken: string,
    private readonly refreshToken: string,
    private readonly tokenType: string = 'Bearer',
    private readonly expiresIn: number = Session.REFRESH_TOKEN_MAX_TTL,
    private readonly createdAt: Date = new Date(),
  ) {
    super(sessionId);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  public static create(
    tokenManagerService: ITokenManagerService,
    userData: ExposedUserData,
  ): Session {
    const sessionId = randomUUID();
    const refreshToken = randomUUID();

    return new Session(
      sessionId,
      tokenManagerService.generate(
        sessionId,
        userData,
        Session.ACCESS_TOKEN_MAX_TTL,
      ),
      refreshToken,
    );
  }

  get accessTokenData(): AccessTokenData {
    return {
      accessToken: this.accessToken,
      tokenType: this.tokenType,
      refreshToken: this.refreshToken,
    };
  }

  get sessionData(): SessionData {
    return {
      sessionId: this.id,
      refreshToken: this.refreshToken,
      expiresIn: this.expiresIn,
      createdAt: this.createdAt,
    };
  }
}
