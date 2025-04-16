import { UserService } from 'src/domain/contexts/users/services/user.service';
import { ConfiguredServicesCollection } from 'src/domain/common/interfaces/services/validation-service.interface';
import { UserSessionsService } from 'src/domain/contexts/sessions/services/session.service';

export interface UserRequiredDomainServices
  extends ConfiguredServicesCollection {
  userService: UserService;
}

export interface SessionsRequiredDomainServices
  extends ConfiguredServicesCollection {
  userSessionsService: UserSessionsService;
}

export interface UserSessionsRequiredDomainServices
  extends ConfiguredServicesCollection {
  userService: UserService;
  userSessionsService: UserSessionsService;
}
