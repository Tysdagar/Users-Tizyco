import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/contexts/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { LoginUserRequest } from './register-user.request';

@Injectable()
@RequestValidator(LoginUserRequest)
export class RegisterUserValidator extends CustomValidator<LoginUserRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  public async validate(request: LoginUserRequest): Promise<boolean> {
    const user = await this.userRepository.findSecureAuthData(request.email);

    if (!user) {
      this.registerFailure('Usuario Existente', 'Este usuario no existe.');
    }

    this.saveValidatedData(user);

    return this.checkValidation();
  }
}
