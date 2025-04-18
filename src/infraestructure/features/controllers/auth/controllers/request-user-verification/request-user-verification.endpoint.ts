import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, HttpCode, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUserVerificationBody } from './request-user-verification.body';
import { RequestUserVerificationRequest } from 'src/application/use-cases/request-user-verification/request-user-verification.request';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-user-verification/request-user-verification.usecase';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class RequestUserVerificationEndpoint extends RequestResolver<
  RequestUserVerificationBody,
  string
> {
  constructor(
    private readonly requestVerificationUseCase: RequestUserVerificationUseCase,
  ) {
    super();
  }

  @Patch(AUTH_ENDPOINT_PATHS.REQUEST_VERIFICATION)
  @HttpCode(200)
  public async execute(
    @Query() query: RequestUserVerificationBody,
  ): Promise<Response<string>> {
    const { userId } = query;

    const request = new RequestUserVerificationRequest(userId);

    const response = await this.requestVerificationUseCase.execute(request);

    return this.ok(response);
  }
}
