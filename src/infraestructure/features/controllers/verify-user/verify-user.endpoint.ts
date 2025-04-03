import { EndpointResolver } from 'src/application/abstract/endpoint-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyUserBody } from './verify-user.body';
import { VerifyUserUseCase } from 'src/application/use-cases/verify-user/verify-user..usecase';
import { VerifyUserRequest } from 'src/application/use-cases/verify-user/verify-user.request';

@ApiTags('Usuarios')
@Controller('user')
export class VerifyUserEndpoint extends EndpointResolver<
  VerifyUserBody,
  string
> {
  constructor(private readonly verifyUserUseCase: VerifyUserUseCase) {
    super();
  }

  @Get('verify-account')
  public async execute(
    @Query() query: VerifyUserBody,
  ): Promise<Response<string>> {
    const { userId, verificationCode } = query;

    const request = new VerifyUserRequest(userId, verificationCode);

    return await this.verifyUserUseCase.execute(request);
  }
}
