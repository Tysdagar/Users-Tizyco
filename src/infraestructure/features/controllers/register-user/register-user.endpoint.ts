import { RequestResolver } from 'src/application/abstract/request-resolver.abstract';
import { RegisterUserBody } from './register-user.body';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { RegisterUserRequest } from 'src/application/use-cases/register-user/register-user.request';

@ApiTags('Usuarios')
@Controller('user')
export class RegisterUserEndpoint extends RequestResolver<
  RegisterUserBody,
  string
> {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {
    super();
  }

  @Post('register')
  public async execute(
    @Body() body: RegisterUserBody,
  ): Promise<Response<string>> {
    const { email, password, confirmatePassword } = body;

    const request = new RegisterUserRequest(
      email,
      password,
      confirmatePassword,
    );

    return await this.registerUseCase.execute(request);
  }
}
