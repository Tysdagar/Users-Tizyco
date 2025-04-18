import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  BypassJwtExpired,
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/auth/guards/jwt-auth.guard';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { RefreshSessionUseCase } from 'src/application/use-cases/refresh-session-user/refresh-session-user.usecase';
import { RefreshSessionRequest } from 'src/application/use-cases/refresh-session-user/refresh-session-user.request';
import { Response as XRes, Request as XReq } from 'express';
import {
  AUTH_COOKIE_CONFIG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
} from '../../configuration/auth-api.config';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class RefreshSessionEndpoint extends RequestResolver<void, string> {
  constructor(private readonly refreshSessionUseCase: RefreshSessionUseCase) {
    super();
  }

  @Post(AUTH_ENDPOINT_PATHS.REFRESH_SESSION)
  @UseGuards(JwtAuthGuard)
  @BypassJwtExpired()
  @HttpCode(200)
  public async execute(
    _,
    @UserAuthenticated() user: UserAuthenticatedData,
    @Req() req: XReq,
    @Res({ passthrough: true }) res: XRes,
  ): Promise<Response<string>> {
    const refreshToken = this.getCookie<string>(
      req,
      AUTH_COOKIE_CONFIG.REFRESH_TOKEN.NAME,
    );

    const request = new RefreshSessionRequest(user, refreshToken);

    const response = await this.refreshSessionUseCase.execute(request);

    this.setCookie(
      res,
      AUTH_COOKIE_CONFIG.REFRESH_TOKEN.NAME,
      response.data.refreshToken,
      response.data.expiresIn,
      AUTH_COOKIE_CONFIG.REFRESH_TOKEN.PATH,
    );

    this.setCookie(
      res,
      AUTH_COOKIE_CONFIG.SESSION_TOKEN.NAME,
      response.data.accessToken,
      response.data.expiresIn,
      AUTH_COOKIE_CONFIG.SESSION_TOKEN.PATH,
    );

    return this.ok(
      Response.withMessage('Se ha refrescado la sesion correctamente.'),
    );
  }
}
