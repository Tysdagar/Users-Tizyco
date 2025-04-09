import { LoginUserRequest } from './login-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';
import { UserService } from 'src/domain/contexts/users/services/user.service';
import { type AccessTokenData } from 'src/domain/contexts/sessions/types/session';
import { UserSessionsService } from 'src/domain/contexts/sessions/services/session.service';

@Injectable()
export class LoginUserUseCase extends UserUseCase<
  LoginUserRequest,
  Response<AccessTokenData>
> {
  constructor(
    private readonly userSessionService: UserSessionsService,
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<LoginUserRequest>,
    userService: UserService,
  ) {
    super(validationService, userService);
  }

  protected async handle(
    request: LoginUserRequest,
  ): Promise<Response<AccessTokenData>> {
    await this.userService.authenticate(request.password);

    const accessToken = await this.userSessionService.login(
      this.user.userExposedData,
    );

    this.userEventPublisher.logged(this.user.id);

    return Response.data<AccessTokenData>(accessToken);
  }
}
