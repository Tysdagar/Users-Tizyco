import { LoginUserRequest } from './login-user.request';
import { Response } from 'src/domain/common/wrappers/response.wrapper';
import {
  IValidationService,
  VALIDATION_SERVICE,
} from 'src/domain/common/interfaces/services/validation-service.interface';
import { UserService } from 'src/domain/contexts/services/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { UserUseCase } from 'src/application/abstract/user-usecase.abstract';

@Injectable()
export class LoginUserUseCase extends UserUseCase<
  LoginUserRequest,
  Response<string>
> {
  constructor(
    private readonly userEventPublisher: UserEventPublisher,
    @Inject(VALIDATION_SERVICE)
    validationService: IValidationService<LoginUserRequest>,
    userService: UserService,
  ) {
    super(validationService, userService);
  }

  protected async handle(request: LoginUserRequest): Promise<Response<string>> {
    await this.userService.login(request.password);

    this.userEventPublisher.logged(this.user.id);

    return Response.message('Usuario inicio sesion exitosamente');
  }
}
