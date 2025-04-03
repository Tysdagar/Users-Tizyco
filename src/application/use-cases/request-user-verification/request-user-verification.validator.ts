import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/domain/contexts/repositories/user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { RequestUserVerificationRequest } from './request-user-verification.request';

@Injectable()
@RequestValidator(RequestUserVerificationRequest)
export class RequestUserVerificationValidator extends CustomValidator<RequestUserVerificationRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {
    super();
  }

  public async validate(
    request: RequestUserVerificationRequest,
  ): Promise<boolean> {
    const user = await this.userRepository.findSecureAuthData(request.userId);

    if (!user) {
      this.registerFailure('Usuario', 'Este usuario no existe.');
    }

    this.saveValidatedData(user);

    return this.checkValidation();
  }
}
