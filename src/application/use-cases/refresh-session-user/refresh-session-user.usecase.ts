import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UseCase } from 'src/application/abstract/use-case.abstract';
import { type AccessTokenData } from 'src/domain/contexts/sessions/types/session';
import { type SessionsRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';
import { RefreshSessionRequest } from './refresh-session-user.request';

@Injectable()
export class RefreshSessionUseCase extends UseCase<
  RefreshSessionRequest,
  Response<AccessTokenData>,
  SessionsRequiredDomainServices
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<RefreshSessionRequest>,
  ) {
    super(validationService);
  }

  protected async handle(
    request: RefreshSessionRequest,
  ): Promise<Response<AccessTokenData>> {
    const accessToken = await this.services.userSessionsService.refreshSession(
      request.userAuthenticatedData,
      request.refreshToken,
    );

    this.userEventPublisher.refreshedSession(
      request.userAuthenticatedData.userId,
    );

    return Response.data<AccessTokenData>(accessToken);
  }
}
