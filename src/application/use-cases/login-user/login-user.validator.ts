import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import { Inject, Injectable } from '@nestjs/common';
import { LoginUserRequest } from '../create-multifactor/create-multifactor.request';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';
import { UserSessionsRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';
import {
  USER_SESSIONS_MANAGER_SERVICE,
  IUserSessionsManagerService,
} from 'src/domain/contexts/sessions/interfaces/session-manager.interface';
import { UserSessionsService } from 'src/domain/contexts/sessions/services/session.service';
import { UserService } from 'src/domain/contexts/users/services/user.service';

@Injectable()
@RequestValidator(LoginUserRequest)
export class LoginUserValidator extends CustomValidator<LoginUserRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(USER_SESSIONS_MANAGER_SERVICE)
    private readonly userSessionsManager: IUserSessionsManagerService,
    private readonly userSessionService: UserSessionsService,
    private readonly userService: UserService,
  ) {
    super();
  }

  public async validate(request: LoginUserRequest): Promise<boolean> {
    const user = await this.userRepository.findAuthDataWithPassword(
      request.email,
    );

    if (!user) {
      return this.failValidation(
        'Usuario Inexistente',
        'Este usuario no existe.',
      );
    }

    const sessions = await this.userSessionsManager.getAll(user.id);

    this.saveConfiguredServices<UserSessionsRequiredDomainServices>({
      userService: this.userService.initialize(user),
      userSessionsService: this.userSessionService.initialize(sessions),
    });

    return this.checkValidation();
  }
}
