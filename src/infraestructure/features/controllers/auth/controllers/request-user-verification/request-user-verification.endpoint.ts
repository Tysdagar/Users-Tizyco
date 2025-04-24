import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, HttpCode, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestUserVerificationRequest } from 'src/application/use-cases/request-user-verification/request-user-verification.request';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-user-verification/request-user-verification.usecase';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';
import {
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/auth/guards/jwt-auth.guard';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class RequestUserVerificationEndpoint extends RequestResolver<
  void,
  string
> {
  constructor(
    private readonly requestVerificationUseCase: RequestUserVerificationUseCase,
  ) {
    super();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(AUTH_ENDPOINT_PATHS.REQUEST_VERIFICATION)
  @HttpCode(200)
  public async execute(
    _,
    @UserAuthenticated() user: UserAuthenticatedData,
  ): Promise<Response<string>> {
    const request = new RequestUserVerificationRequest(user.userId);

    const response = await this.requestVerificationUseCase.execute(request);

    return this.ok(response);
  }
}
