import { LoginUserRequest } from './login-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';
import {
  SESSION_REPOSITORY,
  ISessionRepository,
} from 'src/domain/contexts/sessions/repositories/session.repository';
import { UserService } from 'src/domain/contexts/users/services/user.service';
import { type AccessTokenData } from 'src/domain/contexts/sessions/types/session';
import { SessionService } from 'src/domain/contexts/sessions/services/session.service';
@Injectable()
export class LoginUserUseCase extends UserUseCase<
  LoginUserRequest,
  Response<AccessTokenData>
> {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    private readonly sessionService: SessionService,
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
    await this.userService.login(request.password);

    const session = await this.sessionService.create(this.user.userExposedData);

    await this.sessionRepository.save(this.user.id, session.sessionData);

    this.userEventPublisher.logged(this.user.id);

    return Response.data<AccessTokenData>(session.accessTokenData);
  }
}
