import { RequestResolver } from 'src/application/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BypassJwtExpired,
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/jwt-auth-guard.middleware';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { AccessTokenData } from 'src/domain/contexts/sessions/types/session';
import { RefreshSessionUseCase } from 'src/application/use-cases/refresh-session-user/refresh-session-user.usecase';
import { RefreshSessionRequest } from 'src/application/use-cases/refresh-session-user/refresh-session-user.request';
import { Response as XRes, Request as XReq } from 'express';
import { UnauthorizedException } from 'src/domain/common/errors/unauthorized.exception';

@ApiTags('Usuarios')
@Controller('user')
export class RefreshSessionEndpoint extends RequestResolver<
  void,
  AccessTokenData
> {
  constructor(private readonly RefreshSessionUseCase: RefreshSessionUseCase) {
    super();
  }

  @Post('refresh-session')
  @BypassJwtExpired()
  @UseGuards(JwtAuthGuard)
  public async execute(
    _,
    @UserAuthenticated() user: UserAuthenticatedData,
    @Req() req: XReq,
    @Res({ passthrough: true }) res: XRes,
  ): Promise<Response<AccessTokenData>> {
    const refreshToken = this.getRefreshTokenCookie(req);

    const request = new RefreshSessionRequest(user, refreshToken);

    const response = await this.RefreshSessionUseCase.execute(request);

    this.setRefreshTokenCookie(res, response.data!);

    return this.formatResponse(response);
  }

  private setRefreshTokenCookie(res: XRes, response: AccessTokenData): void {
    res.cookie('__Host-refreshToken', response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: response.expiresIn,
    });
  }

  private getRefreshTokenCookie(req: XReq): string {
    const refreshToken = req.cookies['__Host-refreshToken'] as string;
    if (!refreshToken) {
      throw new UnauthorizedException('El refresh token es requerido.');
    }
    return refreshToken;
  }

  private formatResponse(
    response: Response<AccessTokenData>,
  ): Response<AccessTokenData> {
    delete response.data?.refreshToken;
    delete response.data?.expiresIn;

    return response;
  }
}
