import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';
import { RequestUserVerificationRequest } from './request-user-verification.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import {
  VALIDATION_SERVICE,
  IValidationService,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { UserService } from 'src/domain/contexts/users/services/user.service';

@Injectable()
export class RequestUserVerificationUseCase extends UserUseCase<
  RequestUserVerificationRequest,
  Response<string>
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<RequestUserVerificationRequest>,
    userService: UserService,
  ) {
    super(validationService, userService);
  }

  protected async handle(
    request: RequestUserVerificationRequest,
  ): Promise<Response<string>> {
    await this.userService.requestVerification();

    this.userEventPublisher.requestedVerification(request.userId);

    return Response.message('Se ha enviado el codigo de verificacion.');
  }
}
