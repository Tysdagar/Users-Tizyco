import { CustomValidator } from 'src/application/abstract/custom-validator.abstract';
import { RequestValidator } from 'src/application/decorators/request-validator.decorator';
import { Inject, Injectable } from '@nestjs/common';
import { RefreshSessionRequest } from './refresh-session-user.request';
import {
  USER_REPOSITORY,
  IUserRepository,
} from 'src/domain/contexts/users/repositories/user.repository';
import { SessionsRequiredDomainServices } from 'src/application/abstract/types/required-services-use-cases';
import {
  USER_SESSIONS_MANAGER_SERVICE,
  IUserSessionsManagerService,
} from 'src/domain/contexts/sessions/interfaces/session-manager.interface';
import { UserSessionsService } from 'src/domain/contexts/sessions/services/session.service';

@Injectable()
@RequestValidator(RefreshSessionRequest)
export class RefreshSessionValidator extends CustomValidator<RefreshSessionRequest> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(USER_SESSIONS_MANAGER_SERVICE)
    private readonly userSessionsManager: IUserSessionsManagerService,
    private readonly userSessionService: UserSessionsService,
  ) {
    super();
  }

  public async validate(request: RefreshSessionRequest): Promise<boolean> {
    const user = await this.userRepository.findUserInfo(
      request.userAuthenticatedData.userId,
    );

    if (!user) {
      return this.failValidation(
        'Usuario Inexistente',
        'Este usuario no existe.',
      );
    }

    const sessions = await this.userSessionsManager.getAll(user.id);

    this.saveConfiguredServices<SessionsRequiredDomainServices>({
      userSessionsService: this.userSessionService.initialize(sessions),
    });

    return this.checkValidation();
  }
}
