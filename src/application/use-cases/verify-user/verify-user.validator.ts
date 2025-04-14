import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import { Inject, Injectable } from '@nestjs/common';
import { VerifyUserRequest } from './verify-user.request';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';
import { UserService } from 'src/domain/contexts/users/services/user.service';
import { UserRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';

@Injectable()
@RequestValidator(VerifyUserRequest)
export class VerifyUserValidator extends CustomValidator<VerifyUserRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async validate(request: VerifyUserRequest): Promise<boolean> {
    const user = await this.userRepository.findSecureAuthData(request.userId);

    if (!user) {
      return this.failValidation('Usuario', 'Este usuario no existe.');
    }

    this.saveConfiguredServices<UserRequiredDomainServices>({
      userService: this.userService.initialize(user),
    });

    return this.checkValidation();
  }
}
