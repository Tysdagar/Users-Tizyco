import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UseCase } from 'src/application/abstract/use-case.abstract';
import { UserSessionsRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';
import { CreateMultifactorRequest } from './create-multifactor.request';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';

@Injectable()
export class CreateMultifactorUseCase extends UseCase<
  CreateMultifactorRequest,
  Response<string>,
  UserSessionsRequiredDomainServices
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<CreateMultifactorRequest>,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super(validationService);
  }

  protected async handle(
    request: CreateMultifactorRequest,
  ): Promise<Response<string>> {
    const newMultifactor =
      await this.services.userService.createMultifactorMethod(
        request.method,
        request.contact,
      );

    await this.userRepository.saveMultifactorMethod(
      request.userId,
      newMultifactor,
    );

    this.userEventPublisher.multifactorCreated(request.userId);

    return Response.withMessage('Metodo Multifactor creado.');
  }
}
