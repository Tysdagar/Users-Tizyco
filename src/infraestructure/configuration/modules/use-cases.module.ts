import { Global, Module } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { EventsModule } from './events.module';
import { ValidationModule } from './validation.module';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-user-verification/request-user-verification.usecase';
import { VerifyUserUseCase } from 'src/application/use-cases/verify-user/verify-user..usecase';
import { LoginUserUseCase } from 'src/application/use-cases/login-user/login-user.usecase';
import { LogoutUserUseCase } from 'src/application/use-cases/logout-user/logout-user.usecase';
import { RefreshSessionUseCase } from 'src/application/use-cases/refresh-session-user/refresh-session-user.usecase';
import { CreateMultifactorUseCase } from 'src/application/use-cases/create-multifactor/create-multifactor.usecase';

@Global()
@Module({
  imports: [ValidationModule, EventsModule],
  providers: [
    RegisterUserUseCase,
    RequestUserVerificationUseCase,
    VerifyUserUseCase,
    LoginUserUseCase,
    LogoutUserUseCase,
    RefreshSessionUseCase,
    CreateMultifactorUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    RequestUserVerificationUseCase,
    VerifyUserUseCase,
    LoginUserUseCase,
    LogoutUserUseCase,
    RefreshSessionUseCase,
    CreateMultifactorUseCase,
  ],
})
export class UseCasesModule {}
