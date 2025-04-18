import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerifyUserBody } from './verify-user.body';
import { VerifyUserUseCase } from 'src/application/use-cases/verify-user/verify-user..usecase';
import { VerifyUserRequest } from 'src/application/use-cases/verify-user/verify-user.request';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class VerifyUserEndpoint extends RequestResolver<
  VerifyUserBody,
  string
> {
  constructor(private readonly verifyUserUseCase: VerifyUserUseCase) {
    super();
  }

  @Get(AUTH_ENDPOINT_PATHS.VERIFICATION)
  public async execute(
    @Query() query: VerifyUserBody,
  ): Promise<Response<string>> {
    const { userId, verificationCode } = query;

    const request = new VerifyUserRequest(userId, verificationCode);

    const response = await this.verifyUserUseCase.execute(request);

    return this.ok(response);
  }
}
