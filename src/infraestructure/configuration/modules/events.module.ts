import { Module } from '@nestjs/common';
import { UserEventPublisher } from 'src/application/services/event-publisher.service';
import { EVENT_BUS } from 'src/domain/common/interfaces/concepts/event-bus.interface';
import { NestEventBus } from '../providers/events.provider';
import { RequestedUserVerificationHandler } from 'src/infraestructure/features/event-handlers/verification/requested-user-verification.handler';
import { UserStatusChangedEventHandler } from 'src/infraestructure/features/event-handlers/status/user-status-changed.handler';
import { UserBlockedEventHandler } from 'src/infraestructure/features/event-handlers/status/user-blocked.handler';
import { UserUnblockedEventHandler } from 'src/infraestructure/features/event-handlers/status/user-unblocked.handler';
import { UserAuthenticatedEventHandler } from 'src/infraestructure/features/event-handlers/auth/user-authenticated.handler';
import { UserInvalidCredentialsEventHandler } from 'src/infraestructure/features/event-handlers/auth/invalid-credentials.handler';

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
  providers: [
    RequestedUserVerificationHandler,
    UserStatusChangedEventHandler,
    UserBlockedEventHandler,
    UserUnblockedEventHandler,
    UserAuthenticatedEventHandler,
    UserInvalidCredentialsEventHandler,

    UserEventPublisher,
    { provide: EVENT_BUS, useClass: NestEventBus },
  ],

  /**
   * Exported providers to make them available for use in other modules.
   */
  exports: [
    UserEventPublisher,
    EVENT_BUS,

    RequestedUserVerificationHandler,
    UserStatusChangedEventHandler,
    UserBlockedEventHandler,
    UserUnblockedEventHandler,
    UserAuthenticatedEventHandler,
    UserInvalidCredentialsEventHandler,
  ],
})
export class EventsModule {}
