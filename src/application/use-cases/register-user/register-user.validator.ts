import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/contexts/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { RegisterUserRequest } from './register-user.request';

@Injectable()
@RequestValidator(RegisterUserRequest)
export class RegisterUserValidator extends CustomValidator<RegisterUserRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  public async validate(request: RegisterUserRequest): Promise<boolean> {
    if (request.password !== request.confirmatePassword) {
      this.registerFailure('Contraseña', 'Las contraseñas no coinciden.');
    }

    const exists = await this.userRepository.existsUserByEmail(request.email);

    if (exists) {
      this.registerFailure('Usuario Existente', 'Este usuario ya existe.');
    }

    return this.checkValidation();
  }
}
