import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { ConfigClient } from 'src/infraestructure/configuration/clients/config.client';
import { AUTH_COOKIE_CONFIG } from 'src/infraestructure/features/controllers/auth/configuration/auth-api.config';
import { Request } from 'express';
import { UnauthorizedException } from 'src/domain/common/errors/unauthorized.exception';

interface JwtPayloadWithExp extends UserAuthenticatedData {
  exp?: number;
  iat?: number;
}

export interface UserAuthenticatedPayload extends UserAuthenticatedData {
  isExpired: boolean;
}

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(private readonly configClient: ConfigClient) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookie = request?.cookies?.[
            AUTH_COOKIE_CONFIG.SESSION_TOKEN.NAME
          ] as string;
          if (!cookie) {
            throw new UnauthorizedException('Token de acceso no enviado');
          }
          return cookie;
        },
      ]),
      ignoreExpiration: true,
      secretOrKey: configClient.getPrivateKey(),
    });
  }

  validate(payload: JwtPayloadWithExp): UserAuthenticatedPayload {
    const currentTime = Date.now() / 1000;
    const isExpired = payload.exp ? payload.exp < currentTime : false;

    return {
      ...payload,
      isExpired,
    };
  }
}
