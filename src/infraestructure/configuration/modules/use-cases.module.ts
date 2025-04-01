import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { EventsModule } from './events.module';
import { ValidationModule } from './validation.module';
import { RequestUserVerificationUseCase } from 'src/application/use-cases/request-verification/request-user-verification.usecase';

@Module({
  imports: [ValidationModule, EventsModule],
  providers: [RegisterUserUseCase, RequestUserVerificationUseCase],
  exports: [RegisterUserUseCase, RequestUserVerificationUseCase],
})
export class UseCasesModule {}
