import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { ConfigClient } from 'src/infraestructure/configuration/clients/config.client';

@Injectable()
export class JwtBearerStrategy extends PassportStrategy(
  Strategy,
  'jwt-bearer',
) {
  constructor(private readonly configClient: ConfigClient) {
    const secretKey = configClient.getPrivateKey();

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretKey,
    });
  }

  public validate(payload: UserAuthenticatedData): UserAuthenticatedData {
    return payload;
  }
}
