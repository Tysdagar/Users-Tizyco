import { Module } from '@nestjs/common';
import { UseCasesModule } from './use-cases.module';

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
  providers: [],

  /**
   * Export the command handlers to make them available for other modules.
   */
  exports: [],
})
export class CommandsModule {}
