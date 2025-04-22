import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import { Inject, Injectable } from '@nestjs/common';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';
import { UserService } from 'src/domain/contexts/users/services/user.service';
import { CreateMultifactorRequest } from './create-multifactor.request';
import { UserRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';

@Injectable()
@RequestValidator(CreateMultifactorRequest)
export class CreateMultifactorValidator extends CustomValidator<CreateMultifactorRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async validate(request: CreateMultifactorRequest): Promise<boolean> {
    const user = await this.userRepository.findAuthDataWithMFA(request.userId);

    if (!user) {
      return this.failValidation(
        'Usuario Inexistente',
        'Este usuario no existe.',
      );
    }

    this.saveConfiguredServices<UserRequiredDomainServices>({
      userService: this.userService.initialize(user),
    });

    return this.checkValidation();
  }
}
