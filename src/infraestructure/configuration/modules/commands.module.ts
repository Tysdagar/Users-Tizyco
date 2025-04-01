import { Module } from '@nestjs/common';
import { RegisterUserCommandHandler } from 'src/infraestructure/features/commands/register-user/register-user.handler';
import { UseCasesModule } from './use-cases.module';
import { RequestUserVerificationCommandHandler } from 'src/infraestructure/features/commands/request-user-verification/request-user-verification.handler';

/**
 * The `CommandsHandlerModule` encapsulates all command handlers used
 * across the application to handle CQRS commands, such as user registration,
 * authorization, and client management.
 */
@Module({
  /**
   * Import required modules for command handling.
   */
  imports: [UseCasesModule],

  /**
   * Define the command handlers for various application features.
   */
  providers: [
    RegisterUserCommandHandler,
    RequestUserVerificationCommandHandler,
  ],

  /**
   * Export the command handlers to make them available for other modules.
   */
  exports: [RegisterUserCommandHandler, RequestUserVerificationCommandHandler],
})
export class CommandsModule {}
