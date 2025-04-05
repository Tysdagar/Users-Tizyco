import { LoginUserRequest } from './login-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { UserService } from 'src/domain/contexts/services/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';
import { SessionUserData } from 'src/domain/contexts/types/user';
import {
  ITokenManagerService,
  TOKEN_MANAGER_SERVICE,
} from 'src/domain/contexts/interfaces/token-manager.interface';

@Injectable()
export class LoginUserUseCase extends UserUseCase<
  LoginUserRequest,
  Response<SessionUserData>
> {
  constructor(
    @Inject(TOKEN_MANAGER_SERVICE)
    private readonly tokenService: ITokenManagerService,
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<LoginUserRequest>,
    userService: UserService,
  ) {
    super(validationService, userService);
  }

  protected async handle(
    request: LoginUserRequest,
  ): Promise<Response<SessionUserData>> {
    await this.userService.login(request.password);

    const sessionData = this.tokenService.generate(this.user.userExposedData);

    this.userEventPublisher.logged(sessionData);

    return Response.data<SessionUserData>(sessionData);
  }
}
