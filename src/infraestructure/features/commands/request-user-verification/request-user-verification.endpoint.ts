import { EndpointResolver } from 'src/application/abstract/endpoint-resolver.abstract';
import { RequestUserVerificationBody } from './request-user-verification.body';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { RequestUserVerificationCommand } from './request-user-verification.command';

@ApiTags('Usuarios')
@Controller('user')
export class RequestUserVerificationEndpoint extends EndpointResolver<
  RequestUserVerificationBody,
  string
> {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  @Post('request-verification')
  public async execute(
    @Body() request: RequestUserVerificationBody,
  ): Promise<Response<string>> {
    return await this.commandBus.execute(
      new RequestUserVerificationCommand(request),
    );
  }
}
