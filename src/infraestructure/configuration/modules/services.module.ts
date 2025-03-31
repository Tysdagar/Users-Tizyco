import { EmailClient } from '../clients/email.client';
import { Global, Module } from '@nestjs/common';
import { ENCRYPT_SERVICE } from 'src/domain/common/interfaces/services/encrypt-service.interface';
import { EncryptService } from 'src/infraestructure/services/encrypt.service';
import { SERIALIZE_SERVICE } from 'src/domain/common/interfaces/services/serialize-service.interface';
import { SerializeService } from 'src/infraestructure/services/serialize.service';
import { DataTransformationService } from 'src/infraestructure/services/data-transform.service';
import { EmailService } from 'src/application/services/email.service';
import { UserService } from 'src/domain/contexts/services/user.service';
import { PASSWORD_SECURITY_SERVICE } from 'src/domain/contexts/interfaces/password-security.interface';
import { PasswordSecurityService } from 'src/infraestructure/services/password-security.service';
import { LOGIN_ATTEMPTS_SERVICE } from 'src/domain/contexts/interfaces/login-attempts.interface';
import { LoginAttemptService } from 'src/infraestructure/services/login-attempt.service';
import { EventsModule } from './events.module';

@Global()
@Module({
  imports: [EventsModule],
  providers: [
    UserService,
    DataTransformationService,

    { provide: EmailService, useClass: EmailClient },
    { provide: LOGIN_ATTEMPTS_SERVICE, useClass: LoginAttemptService },
    { provide: PASSWORD_SECURITY_SERVICE, useClass: PasswordSecurityService },
    { provide: ENCRYPT_SERVICE, useClass: EncryptService },
    { provide: SERIALIZE_SERVICE, useClass: SerializeService },
  ],
  exports: [
    UserService,
    DataTransformationService,

    EmailService,
    PASSWORD_SECURITY_SERVICE,
    ENCRYPT_SERVICE,
    SERIALIZE_SERVICE,
  ],
})
export class ServicesModule {}
