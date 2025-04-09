import { EmailClient } from '../clients/email.client';
import { Global, Module } from '@nestjs/common';
import { ENCRYPT_SERVICE } from 'src/domain/common/interfaces/services/encrypt-service.interface';
import { EncryptService } from 'src/infraestructure/helpers/encrypt.service';
import { SERIALIZE_SERVICE } from 'src/domain/common/interfaces/services/serialize-service.interface';
import { SerializeService } from 'src/infraestructure/helpers/serialize.service';
import { DataTransformationService } from 'src/infraestructure/helpers/data-transform.service';
import { EmailService } from 'src/application/services/email.service';
import { JWTTokenManagerService } from 'src/infraestructure/services/jwt-token-manager.service';
import { AuthModule } from './auth.module';
import { TOKEN_MANAGER_SERVICE } from 'src/domain/contexts/sessions/interfaces/token-manager.interface';
import { LOGIN_ATTEMPTS_SERVICE } from 'src/domain/contexts/users/interfaces/login-attempts.interface';
import { PASSWORD_SECURITY_SERVICE } from 'src/domain/contexts/users/interfaces/password-security.interface';
import { VERIFICATION_USER_SERVICE } from 'src/domain/contexts/users/interfaces/verification-account.interface';
import { UserService } from 'src/domain/contexts/users/services/user.service';
import { RedisLoginAttemptService } from 'src/infraestructure/services/login-attempt.service';
import { BcryptPasswordSecurityService } from 'src/infraestructure/services/bcrypt-password-security.service';
import { RedisVerificationUserService } from 'src/infraestructure/services/redis-verification-user.service';
import { EventsModule } from './events.module';
import { UserSessionsService } from 'src/domain/contexts/sessions/services/session.service';
import { USER_SESSIONS_MANAGER_SERVICE } from 'src/domain/contexts/sessions/interfaces/session-manager.interface';
import { RedisUserSessionsManagerService } from 'src/infraestructure/services/redis-user-sessions-manager.service';
import { FINGERPRINT_SERVICE } from 'src/domain/contexts/sessions/interfaces/device-info.interface';
import { FingerPrintService } from 'src/infraestructure/services/device-info.service';

@Global()
@Module({
  imports: [EventsModule, AuthModule],
  providers: [
    UserService,
    UserSessionsService,
    DataTransformationService,

    { provide: EmailService, useClass: EmailClient },
    {
      provide: USER_SESSIONS_MANAGER_SERVICE,
      useClass: RedisUserSessionsManagerService,
    },
    { provide: FINGERPRINT_SERVICE, useClass: FingerPrintService },
    { provide: TOKEN_MANAGER_SERVICE, useClass: JWTTokenManagerService },
    {
      provide: VERIFICATION_USER_SERVICE,
      useClass: RedisVerificationUserService,
    },
    { provide: LOGIN_ATTEMPTS_SERVICE, useClass: RedisLoginAttemptService },
    {
      provide: PASSWORD_SECURITY_SERVICE,
      useClass: BcryptPasswordSecurityService,
    },
    { provide: ENCRYPT_SERVICE, useClass: EncryptService },
    { provide: SERIALIZE_SERVICE, useClass: SerializeService },
  ],
  exports: [
    UserService,
    UserSessionsService,
    DataTransformationService,

    EmailService,
    USER_SESSIONS_MANAGER_SERVICE,
    FINGERPRINT_SERVICE,
    TOKEN_MANAGER_SERVICE,
    VERIFICATION_USER_SERVICE,
    LOGIN_ATTEMPTS_SERVICE,
    PASSWORD_SECURITY_SERVICE,
    ENCRYPT_SERVICE,
    SERIALIZE_SERVICE,
  ],
})
export class ServicesModule {}
