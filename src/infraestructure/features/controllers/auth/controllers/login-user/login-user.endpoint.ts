import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserUseCase } from 'src/application/use-cases/login-user/login-user.usecase';
import { LoginUserBody } from './login-user.body';
import { Response as XRes } from 'express';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_COOKIE_CONFIG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';
import { LoginUserRequest } from 'src/application/use-cases/login-user/login-user.request';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class LoginUserEndpoint extends RequestResolver<LoginUserBody, string> {
  constructor(private readonly loginUseCase: LoginUserUseCase) {
    super();
  }

  @Post(AUTH_ENDPOINT_PATHS.LOGIN)
  @HttpCode(200)
  public async execute(
    @Body() body: LoginUserBody,
    @Res({ passthrough: true }) res: XRes,
  ): Promise<Response<string>> {
    const { email, password } = body;

    const request = new LoginUserRequest(email, password);

    const response = await this.loginUseCase.execute(request);

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

    return this.ok(Response.withMessage('Autenticado.'));
  }
}
