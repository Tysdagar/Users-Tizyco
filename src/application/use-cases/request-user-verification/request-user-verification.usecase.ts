import { UseCase } from 'src/application/abstract/use-case.abstract';
import { RequestUserVerificationRequest } from './request-user-verification.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import {
  VALIDATION_SERVICE,
  IValidationService,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { UserRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';

@Injectable()
export class RequestUserVerificationUseCase extends UseCase<
  RequestUserVerificationRequest,
  Response<string>,
  UserRequiredDomainServices
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<RequestUserVerificationRequest>,
  ) {
    super(validationService);
  }

  protected async handle(
    request: RequestUserVerificationRequest,
  ): Promise<Response<string>> {
    await this.services.userService.requestVerification();

    this.userEventPublisher.requestedVerification(request.userId);

    return Response.message('Se ha enviado el codigo de verificacion.');
  }
}
