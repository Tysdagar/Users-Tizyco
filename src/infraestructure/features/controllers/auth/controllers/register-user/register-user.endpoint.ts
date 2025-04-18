import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { RegisterUserBody } from './register-user.body';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { RegisterUserRequest } from 'src/application/use-cases/register-user/register-user.request';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class RegisterUserEndpoint extends RequestResolver<
  RegisterUserBody,
  string
> {
  constructor(private readonly registerUseCase: RegisterUserUseCase) {
    super();
  }

  @Post(AUTH_ENDPOINT_PATHS.REGISTER)
  @HttpCode(201)
  public async execute(
    @Body() body: RegisterUserBody,
  ): Promise<Response<string>> {
    const { email, password, confirmatePassword } = body;

    const request = new RegisterUserRequest(
      email,
      password,
      confirmatePassword,
    );

    const response = await this.registerUseCase.execute(request);

    return this.ok(response);
  }
}
