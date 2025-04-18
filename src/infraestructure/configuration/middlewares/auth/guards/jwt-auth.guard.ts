import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UnauthorizedException } from 'src/domain/common/errors/unauthorized.exception';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserAuthenticatedPayload } from '../strategies/jwt-cookie.strategy';

export const BypassJwtExpired = () => SetMetadata('BypassJwtExpired', true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-cookie') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public override handleRequest<TUser = UserAuthenticatedPayload>(
    err: unknown,
    user: TUser,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    const bypass = this.getBypassStatus(context);
    const payload = user as unknown as UserAuthenticatedPayload;

    if (bypass && payload?.isExpired) {
      return user;
    }

    if (bypass && !err && !payload?.isExpired) {
      throw new UnauthorizedException('La sesión no ha expirado.');
    }

    if (err || !user) {
      throw new UnauthorizedException('No autorizado');
    }

    return user;
  }

  private getBypassStatus(context: ExecutionContext): boolean {
    return (
      this.reflector.getAllAndOverride<boolean>('BypassJwtExpired', [
        context.getHandler(),
        context.getClass(),
      ]) ?? false
    );
  }
}

interface UserAuthenticatedData {
  userId: string;
  email: string;
  fullName: string | null;
  status: string;
}

export const UserAuthenticated = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserAuthenticatedData => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const payload = request.user as Record<string, unknown>;

    if (!payload) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userData: UserAuthenticatedData = {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string | null,
      status: payload.status as string,
    };

    return userData;
  },
);
