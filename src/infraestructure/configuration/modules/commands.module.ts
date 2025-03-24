import { Module } from '@nestjs/common';
import { ValidationModule } from './validation.module';
import { EventsModule } from './events.module';

/**
 * The `CommandsHandlerModule` encapsulates all command handlers used
 * across the application to handle CQRS commands, such as user registration,
 * authorization, and client management.
 */
@Module({
  /**
   * Import required modules for command handling.
   */
  imports: [ValidationModule, EventsModule],

  /**
   * Define the command handlers for various application features.
   */
  providers: [],

  /**
   * Export the command handlers to make them available for other modules.
   */
  exports: [],
})
export class CommandsHandlerModule {}
