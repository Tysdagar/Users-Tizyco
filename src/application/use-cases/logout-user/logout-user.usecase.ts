import { LogoutUserRequest } from './logout-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UseCase } from 'src/application/abstract/use-case.abstract';
import { UserSessionsRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';

@Injectable()
export class LogoutUserUseCase extends UseCase<
  LogoutUserRequest,
  Response<string>,
  UserSessionsRequiredDomainServices
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<LogoutUserRequest>,
  ) {
    super(validationService);
  }

  protected async handle(
    request: LogoutUserRequest,
  ): Promise<Response<string>> {
    await this.services.userSessionsService.logout();

    this.userEventPublisher.loggedOut(request.userId);

    return Response.withMessage('Se ha cerrado la sesion correctamente.');
  }
}
