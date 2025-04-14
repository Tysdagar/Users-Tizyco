import { RequestResolver } from 'src/application/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogoutUserBody } from './logout-user.body';
import { LogoutUserRequest } from 'src/application/use-cases/logout-user/logout-user.request';
import { LogoutUserUseCase } from 'src/application/use-cases/logout-user/logout-user.usecase';

@ApiTags('Usuarios')
@Controller('user')
export class LogoutUserEndpoint extends RequestResolver<
  LogoutUserBody,
  string
> {
  constructor(private readonly logoutUseCase: LogoutUserUseCase) {
    super();
  }

  @Post('logout')
  public async execute(
    @Query() body: LogoutUserBody,
  ): Promise<Response<string>> {
    const { userId } = body;

    const request = new LogoutUserRequest(userId);

    return await this.logoutUseCase.execute(request);
  }
}
