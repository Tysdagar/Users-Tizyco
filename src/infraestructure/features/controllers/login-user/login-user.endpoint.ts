import { EndpointResolver } from 'src/application/abstract/endpoint-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserRequest } from 'src/application/use-cases/login-user/login-user.request';
import { LoginUserUseCase } from 'src/application/use-cases/login-user/login-user.usecase';
import { LoginUserBody } from './login-user.body';
import { SessionUserData } from 'src/domain/contexts/types/user';
import { Response as XRes } from 'express';

@ApiTags('Usuarios')
@Controller('user')
export class LoginUserEndpoint extends EndpointResolver<
  LoginUserBody,
  SessionUserData
> {
  constructor(private readonly loginUseCase: LoginUserUseCase) {
    super();
  }

  @Post('login')
  public async execute(
    @Body() body: LoginUserBody,
    @Res({ passthrough: true }) res: XRes,
  ): Promise<Response<SessionUserData>> {
    const { email, password } = body;

    const request = new LoginUserRequest(email, password);

    const response = await this.loginUseCase.execute(request);

    res.cookie('__Host-refreshToken', response.data?.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: response.data?.expiresIn,
    });

    delete response.data?.refreshToken;
    delete response.data?.expiresIn;

    return response;
  }
}
