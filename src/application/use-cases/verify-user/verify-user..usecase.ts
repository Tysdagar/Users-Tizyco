import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import {
  VALIDATION_SERVICE,
  IValidationService,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { UserService } from 'src/domain/contexts/services/user.service';
import { VerifyUserRequest } from './verify-user.request';

@Injectable()
export class VerifyUserUseCase extends UserUseCase<
  VerifyUserRequest,
  Response<string>
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<VerifyUserRequest>,
    userService: UserService,
  ) {
    super(validationService, userService);
  }

  protected async handle(
    request: VerifyUserRequest,
  ): Promise<Response<string>> {
    await this.userService.verifyAccount(request.verificationCode);

    this.userEventPublisher.verified(this.user.id);

    return Response.message('El usuario ha sido verificado correctamente.');
  }
}
