import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigClient } from '../clients/config.client';
import { UnauthorizedException } from 'src/domain/common/errors/unauthorized.exception';
import { Request } from 'express';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { Reflector } from '@nestjs/core';

export const BypassJwtExpired = () => SetMetadata('BypassJwtExpired', true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public handleRequest<TUser = UserAuthenticatedData>(
    err: Error,
    user: TUser,
    context: ExecutionContext,
  ): TUser {
    const bypass = this.reflector.get<boolean>(
      'BypassJwtExpired',
      context.getHandler(),
    );

    if (bypass && user && err?.name === 'TokenExpiredError') {
      return user;
    }

    if (bypass && !err) {
      throw new UnauthorizedException('La sesion no ha expirado.');
    }

    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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

export const UserAuthenticated = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserAuthenticatedData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as UserAuthenticatedData;
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  },
);
