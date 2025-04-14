import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigClient } from '../clients/config.client';
import { UnauthorizedException } from 'src/domain/common/errors/unauthorized.exception';
import { Request } from 'express';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = UserAuthenticatedData>(err: Error, user: TUser): TUser {
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
