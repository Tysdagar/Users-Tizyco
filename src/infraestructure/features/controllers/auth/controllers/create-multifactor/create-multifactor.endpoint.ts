import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMultifactorBody } from './create-multifactor.body';
import {
  AUTH_API_GROUP,
  AUTH_API_TAG,
  AUTH_ENDPOINT_PATHS,
} from '../../configuration/auth-api.config';
import { CreateMultifactorUseCase } from 'src/application/use-cases/create-multifactor/create-multifactor.usecase';
import {
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/auth/guards/jwt-auth.guard';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { CreateMultifactorRequest } from 'src/application/use-cases/create-multifactor/create-multifactor.request';

@ApiTags(AUTH_API_TAG)
@Controller(AUTH_API_GROUP)
export class CreateMultifactorEndpoint extends RequestResolver<
  CreateMultifactorBody,
  string
> {
  constructor(
    private readonly createMultifactorUseCase: CreateMultifactorUseCase,
  ) {
    super();
  }

  @Post(AUTH_ENDPOINT_PATHS.CREATE_MULTIFACTOR)
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  public async execute(
    @Body() body: CreateMultifactorBody,
    @UserAuthenticated() user: UserAuthenticatedData,
  ): Promise<Response<string>> {
    const { userId } = user;

    const request = new CreateMultifactorRequest(
      userId,
      body.method,
      body.contact,
    );

    const response = await this.createMultifactorUseCase.execute(request);

    return this.ok(response);
  }
}
