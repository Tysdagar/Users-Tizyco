import { Global, Module } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { EventsModule } from './events.module';
import { ValidationModule } from './validation.module';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-user-verification/request-user-verification.usecase';
import { VerifyUserUseCase } from 'src/application/use-cases/verify-user/verify-user..usecase';

@Global()
@Module({
  imports: [ValidationModule, EventsModule],
  providers: [
    RegisterUserUseCase,
    RequestUserVerificationUseCase,
    VerifyUserUseCase,
  ],
  exports: [
    RegisterUserUseCase,
    RequestUserVerificationUseCase,
    VerifyUserUseCase,
  ],
})
export class UseCasesModule {}
