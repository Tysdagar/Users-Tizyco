import { EndpointResolver } from 'src/application/abstract/endpoint-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserRequest } from 'src/application/use-cases/login-user/login-user.request';
import { LoginUserUseCase } from 'src/application/use-cases/login-user/login-user.usecase';
import { LoginUserBody } from './login-user.body';
import { Response as XRes } from 'express';
import { type AccessTokenData } from 'src/domain/contexts/sessions/types/session';

@ApiTags('Usuarios')
@Controller('user')
export class LoginUserEndpoint extends EndpointResolver<
  LoginUserBody,
  AccessTokenData
> {
  constructor(private readonly loginUseCase: LoginUserUseCase) {
    super();
  }

  @Post('login')
  public async execute(
    @Body() body: LoginUserBody,
    @Res({ passthrough: true }) res: XRes,
  ): Promise<Response<AccessTokenData>> {
    const { email, password } = body;

    const request = new LoginUserRequest(email, password);

    const response = await this.loginUseCase.execute(request);

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

  private formatResponse(
    response: Response<AccessTokenData>,
  ): Response<AccessTokenData> {
    delete response.data?.refreshToken;
    delete response.data?.expiresIn;

    return response;
  }
}
