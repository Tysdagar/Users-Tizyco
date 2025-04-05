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
  TOKEN_MANAGER_SERVICE,
  ITokenManagerService,
} from 'src/domain/contexts/sessions/interfaces/token-manager.interface';
import {
  SESSION_REPOSITORY,
  ISessionRepository,
} from 'src/domain/contexts/sessions/repositories/session.repository';
import { UserService } from 'src/domain/contexts/users/services/user.service';
@Injectable()
export class LoginUserUseCase extends UserUseCase<
  LoginUserRequest,
  Response<Session>
> {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
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

    await this.sessionRepository.save(sessionData);

    this.userEventPublisher.logged(this.user.id);

    return Response.data<SessionUserData>(sessionData);
  }
}
