import { RequestResolver } from 'src/application/abstract/request-resolver.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LogoutUserRequest } from 'src/application/use-cases/logout-user/logout-user.request';
import { LogoutUserUseCase } from 'src/application/use-cases/logout-user/logout-user.usecase';
import {
  JwtAuthGuard,
  UserAuthenticated,
} from 'src/infraestructure/configuration/middlewares/jwt-auth-guard.middleware';
import { UserAuthenticatedData } from 'src/domain/contexts/users/types/user';

@ApiTags('Usuarios')
@Controller('user')
export class LogoutUserEndpoint extends RequestResolver<void, string> {
  constructor(private readonly logoutUseCase: LogoutUserUseCase) {
    super();
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  public async execute(
    _,
    @UserAuthenticated() user: UserAuthenticatedData,
  ): Promise<Response<string>> {
    const { userId } = user;

    const request = new LogoutUserRequest(userId);

    return await this.logoutUseCase.execute(request);
  }
}
