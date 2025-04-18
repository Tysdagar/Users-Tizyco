import { RegisterUserRequest } from './register-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UseCase } from 'src/application/abstract/use-case.abstract';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';
import { UserService } from 'src/domain/contexts/users/services/user.service';

@Injectable()
export class RegisterUserUseCase extends UseCase<
  RegisterUserRequest,
  Response<string>
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<RegisterUserRequest>,
    private userService: UserService,
  ) {
    super(validationService);
  }

  protected async handle(
    request: RegisterUserRequest,
  ): Promise<Response<string>> {
    const user = await this.userService.register(
      request.email,
      request.password,
    );
    await this.userRepository.save(user);

    this.userEventPublisher.registered(
      user.createdState.userId,
      user.createdState.email,
    );

    return Response.withMessage('Usuario creado exitosamente.');
  }
}
