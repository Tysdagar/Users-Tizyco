import { IUseCase } from 'src/domain/common/interfaces/concepts/use-case';
import { RegisterUserRequest } from './register.request';
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

@Injectable()
export class RegisterUserUseCase
  implements IUseCase<RegisterUserRequest, Response<string>>
{
  constructor(
    @Inject(VALIDATION_SERVICE)
    private readonly validationService: IValidationService<RegisterUserRequest>,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
  ) {}

  public async handle(request: RegisterUserRequest): Promise<Response<string>> {
    await this.validationService.executeValidationGuard(request);

    const user = await this.userService.register(
      request.email,
      request.password,
    );

    await this.userRepository.save(user);

    return Response.message('Usuario creado exitosamente.');
  }
}
