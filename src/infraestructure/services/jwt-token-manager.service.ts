import { JwtService } from '@nestjs/jwt';
import { ConfigClient } from '../configuration/clients/config.client';
import { Injectable } from '@nestjs/common';
import { ITokenManagerService } from 'src/domain/contexts/sessions/interfaces/token-manager.interface';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';

@Injectable()
export class JWTTokenManagerService implements ITokenManagerService {
  constructor(
    private readonly jwt: JwtService,
    private readonly configClient: ConfigClient,
  ) {}

  public generate(
    sessionId: string,
    payload: UserAuthenticatedData,
    expiresIn: number,
  ): string {
    return this.jwt.sign(payload, {
      issuer: this.configClient.getIssuer(),
      expiresIn,
      jwtid: sessionId,
    });
  }
}
