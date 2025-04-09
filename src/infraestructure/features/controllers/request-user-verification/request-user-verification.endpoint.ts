import { RequestResolver } from 'src/application/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUserVerificationBody } from './request-user-verification.body';
import { RequestUserVerificationRequest } from 'src/application/use-cases/request-user-verification/request-user-verification.request';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-user-verification/request-user-verification.usecase';

@ApiTags('Usuarios')
@Controller('user')
export class RequestUserVerificationEndpoint extends RequestResolver<
  RequestUserVerificationBody,
  string
> {
  constructor(
    private readonly requestVerificationUseCase: RequestUserVerificationUseCase,
  ) {
    super();
  }

  @Patch('request-verification')
  public async execute(
    @Query() query: RequestUserVerificationBody,
  ): Promise<Response<string>> {
    const { userId } = query;

    const request = new RequestUserVerificationRequest(userId);

    return await this.requestVerificationUseCase.execute(request);
  }
}
