import { RegisterUserRequest } from './register-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/contexts/repositories/user.repository';
import { UserService } from 'src/domain/contexts/services/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';

@Injectable()
export class RegisterUserUseCase extends UserUseCase<
  RegisterUserRequest,
  Response<string>
> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<RegisterUserRequest>,
    userService: UserService,
  ) {
    super(validationService, userService);
  }

  protected async handle(
    request: RegisterUserRequest,
  ): Promise<Response<string>> {
    const user = await this.userService.register(
      request.email,
      request.password,
    );

    await this.userRepository.save(user);

    this.userEventPublisher.registered(user);

    return Response.message('Usuario creado exitosamente.');
  }
}
