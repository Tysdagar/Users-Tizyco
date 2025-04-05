import { EmailClient } from '../clients/email.client';
import { Global, Module } from '@nestjs/common';
import { ENCRYPT_SERVICE } from 'src/domain/common/interfaces/services/encrypt-service.interface';
import { EncryptService } from 'src/infraestructure/helpers/encrypt.service';
import { SERIALIZE_SERVICE } from 'src/domain/common/interfaces/services/serialize-service.interface';
import { SerializeService } from 'src/infraestructure/helpers/serialize.service';
import { DataTransformationService } from 'src/infraestructure/helpers/data-transform.service';
import { EmailService } from 'src/application/services/email.service';
import { TokenManagerService } from 'src/infraestructure/services/token-manager.service';
import { AuthModule } from './auth.module';
import { TOKEN_MANAGER_SERVICE } from 'src/domain/contexts/sessions/interfaces/token-manager.interface';
import { LOGIN_ATTEMPTS_SERVICE } from 'src/domain/contexts/users/interfaces/login-attempts.interface';
import { PASSWORD_SECURITY_SERVICE } from 'src/domain/contexts/users/interfaces/password-security.interface';
import { VERIFICATION_USER_SERVICE } from 'src/domain/contexts/users/interfaces/verification-account.interface';
import { UserService } from 'src/domain/contexts/users/services/user.service';
import { LoginAttemptService } from 'src/infraestructure/services/login-attempt.service';
import { PasswordSecurityService } from 'src/infraestructure/services/password-security.service';
import { VerificationUserService } from 'src/infraestructure/services/verification-user.service';
import { EventsModule } from './events.module';

@Global()
@Module({
  imports: [EventsModule, AuthModule],
  providers: [
    UserService,
    DataTransformationService,

    { provide: EmailService, useClass: EmailClient },
    { provide: TOKEN_MANAGER_SERVICE, useClass: TokenManagerService },
    { provide: VERIFICATION_USER_SERVICE, useClass: VerificationUserService },
    { provide: LOGIN_ATTEMPTS_SERVICE, useClass: LoginAttemptService },
    { provide: PASSWORD_SECURITY_SERVICE, useClass: PasswordSecurityService },
    { provide: ENCRYPT_SERVICE, useClass: EncryptService },
    { provide: SERIALIZE_SERVICE, useClass: SerializeService },
  ],
  exports: [
    UserService,
    DataTransformationService,

    EmailService,
    TOKEN_MANAGER_SERVICE,
    VERIFICATION_USER_SERVICE,
    LOGIN_ATTEMPTS_SERVICE,
    PASSWORD_SECURITY_SERVICE,
    ENCRYPT_SERVICE,
    SERIALIZE_SERVICE,
  ],
})
export class ServicesModule {}
