import { Module } from '@nestjs/common';

/**
 * The `EventsModule` is responsible for managing event-based communication
 * and logic within the application, particularly related to user operations.
 *
 * This module defines event handlers and a publisher for user-related events.
 */
@Module({
  /**
   * Handlers and publishers registered as providers.
   */
  providers: [],

  /**
   * Exported providers to make them available for use in other modules.
   */
  exports: [],
})
export class EventsModule {}
