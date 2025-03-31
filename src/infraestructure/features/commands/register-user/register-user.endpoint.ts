import { EndpointResolver } from 'src/application/abstract/endpoint-resolver.abstract';
import { RegisterUserBody } from './register-user.body';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from './register-user.command';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuarios')
@Controller('user')
export class RegisterUserEndpoint extends EndpointResolver<
  RegisterUserBody,
  string
> {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  @Post('register')
  public async execute(
    @Body() request: RegisterUserBody,
  ): Promise<Response<string>> {
    return await this.commandBus.execute(new RegisterUserCommand(request));
  }
}
