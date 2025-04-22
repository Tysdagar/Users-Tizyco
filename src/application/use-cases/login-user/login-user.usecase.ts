import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UseCase } from 'src/application/abstract/use-case.abstract';
import { type AccessTokenData } from 'src/domain/contexts/sessions/types/session';
import { UserSessionsRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';
import { LoginUserRequest } from './login-user.request';

@Injectable()
export class LoginUserUseCase extends UseCase<
  LoginUserRequest,
  Response<AccessTokenData>,
  UserSessionsRequiredDomainServices
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<LoginUserRequest>,
  ) {
    super(validationService);
  }

  protected async handle(
    request: LoginUserRequest,
  ): Promise<Response<AccessTokenData>> {
    const userDataAuthenticated = await this.services.userService.authenticate(
      request.password,
    );

    const accessToken = await this.services.userSessionsService.login(
      userDataAuthenticated,
    );

    this.userEventPublisher.logged(userDataAuthenticated.userId);

    return Response.withData<AccessTokenData>(accessToken);
  }
}
