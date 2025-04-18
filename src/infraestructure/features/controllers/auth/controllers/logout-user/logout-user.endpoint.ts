import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogoutUserRequest } from 'src/application/use-cases/logout-user/logout-user.request';
import { LogoutUserUseCase } from 'src/application/use-cases/logout-user/logout-user.usecase';
import {
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/auth/guards/jwt-auth.guard';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { Response as XRes } from 'express';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_COOKIE_CONFIG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class LogoutUserEndpoint extends RequestResolver<void, string> {
  constructor(private readonly logoutUseCase: LogoutUserUseCase) {
    super();
  }

  @Post(AUTH_ENDPOINT_PATHS.LOGOUT)
  @UseGuards(JwtAuthGuard)
  public async execute(
    _,
    @UserAuthenticated() user: UserAuthenticatedData,
    @Res({ passthrough: true }) res: XRes,
  ): Promise<Response<string>> {
    const { userId } = user;

    const request = new LogoutUserRequest(userId);

    const response = await this.logoutUseCase.execute(request);

    this.deleteCookie(
      res,
      AUTH_COOKIE_CONFIG.REFRESH_TOKEN.NAME,
      AUTH_COOKIE_CONFIG.REFRESH_TOKEN.PATH,
    );

    this.deleteCookie(
      res,
      AUTH_COOKIE_CONFIG.SESSION_TOKEN.NAME,
      AUTH_COOKIE_CONFIG.SESSION_TOKEN.PATH,
    );

    return this.ok(response);
  }
}
