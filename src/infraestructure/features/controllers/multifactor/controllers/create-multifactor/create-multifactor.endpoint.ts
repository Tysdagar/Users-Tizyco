import { RequestResolver } from 'src/infraestructure/features/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateMultifactorBody } from './create-multifactor.body';
import { CreateMultifactorUseCase } from 'src/application/use-cases/create-multifactor/create-multifactor.usecase';
import {
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/auth/guards/jwt-auth.guard';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';
import { CreateMultifactorRequest } from 'src/application/use-cases/create-multifactor/create-multifactor.request';
import {
  MULTIFACTOR_API_GROUP,
  MULTIFACTOR_API_TAG,
  MULTIFACTOR_ENDPOINT_PATHS,
} from '../../configuration/multifactor-api.config';

@ApiTags(MULTIFACTOR_API_TAG)
@Controller(MULTIFACTOR_API_GROUP)
export class CreateMultifactorEndpoint extends RequestResolver<
  CreateMultifactorBody,
  string
> {
  constructor(
    private readonly createMultifactorUseCase: CreateMultifactorUseCase,
  ) {
    super();
  }

  @Post(MULTIFACTOR_ENDPOINT_PATHS.CREATE_MULTIFACTOR)
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
