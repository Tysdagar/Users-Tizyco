import { JwtService } from '@nestjs/jwt';
import { ITokenManagerService } from 'src/domain/contexts/interfaces/token-manager.interface';
import {
  ExposedUserData,
  SessionUserData,
} from 'src/domain/contexts/types/user';
import { ConfigClient } from '../configuration/clients/config.client';
import { randomUUID } from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenManagerService implements ITokenManagerService {
  private static readonly TOKEN_TYPE = 'Bearer';
  private static readonly REFRESH_TOKEN_TTL = 604800; // 7 dias
  private static readonly ACCESS_TOKEN_TTL = 900; // 15 min

  constructor(
    private readonly jwt: JwtService,
    private readonly configClient: ConfigClient,
  ) {}

  public generate(payload: ExposedUserData): SessionUserData {
    return {
      accessToken: this.jwt.sign(payload, {
        issuer: this.configClient.getIssuer(),
        expiresIn: TokenManagerService.ACCESS_TOKEN_TTL,
        jwtid: randomUUID(),
      }),
      expiresIn: TokenManagerService.REFRESH_TOKEN_TTL,
      tokenType: TokenManagerService.TOKEN_TYPE,
      refreshToken: randomUUID(),
    };
  }
}
