import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import { Inject, Injectable } from '@nestjs/common';
import { LoginUserRequest } from './login-user.request';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';

@Injectable()
@RequestValidator(LoginUserRequest)
export class LoginUserValidator extends CustomValidator<LoginUserRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  public async validate(request: LoginUserRequest): Promise<boolean> {
    const user = await this.userRepository.findAuthDataWithPassword(
      request.email,
    );

    if (!user) {
      this.registerFailure('Usuario Inexistente', 'Este usuario no existe.');
    }

    this.saveValidatedData(user);

    return this.checkValidation();
  }
}
