import { EndpointResolver } from 'src/application/abstract/endpoint-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserRequest } from 'src/application/use-cases/login-user/login-user.request';
import { LoginUserUseCase } from 'src/application/use-cases/login-user/login-user.usecase';
import { LoginUserBody } from './login-user.body';

@ApiTags('Usuarios')
@Controller('user')
export class LoginUserEndpoint extends EndpointResolver<LoginUserBody, string> {
  constructor(private readonly loginUseCase: LoginUserUseCase) {
    super();
  }

  @Post('login')
  public async execute(@Body() body: LoginUserBody): Promise<Response<string>> {
    const { email, password } = body;

    const request = new LoginUserRequest(email, password);

    return await this.loginUseCase.execute(request);
  }
}
