import { Module } from '@nestjs/common';
import { RegisterUserUseCase } from 'src/application/use-cases/register-user/register-user.usecase';
import { EventsModule } from './events.module';
import { ValidationModule } from './validation.module';

@Module({
  imports: [ValidationModule, EventsModule],
  providers: [RegisterUserUseCase],
  exports: [RegisterUserUseCase],
})
export class UseCasesModule {}
