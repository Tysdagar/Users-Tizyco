import { UseCase } from 'src/application/abstract/use-case.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import {
  VALIDATION_SERVICE,
  IValidationService,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { VerifyUserRequest } from './verify-user.request';
import { type UserRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';

@Injectable()
export class VerifyUserUseCase extends UseCase<
  VerifyUserRequest,
  Response<string>,
  UserRequiredDomainServices
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<VerifyUserRequest>,
  ) {
    super(validationService);
  }

  protected async handle(
    request: VerifyUserRequest,
  ): Promise<Response<string>> {
    await this.services.userService.verifyAccount(request.verificationCode);

    this.userEventPublisher.verified(request.userId);

    return Response.message('El usuario ha sido verificado correctamente.');
  }
}
