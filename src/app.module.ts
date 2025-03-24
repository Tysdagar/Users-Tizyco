import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ValidationModule } from './infraestructure/configuration/modules/validation.module';
import { CommandsHandlerModule } from './infraestructure/configuration/modules/commands.module';
import { RepositoriesModule } from './infraestructure/configuration/modules/repositories.module';
import { EnumSyncModule } from './infraestructure/configuration/modules/enum-sync.module';
import { ServicesModule } from './infraestructure/configuration/modules/services.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './infraestructure/configuration/modules/events.module';
import { EndpointsModule } from './infraestructure/configuration/modules/endpoints.module';

/**
 * Root application module for NestJS.
 */
@Module({
  imports: [
    EndpointsModule,
    RepositoriesModule,
    ServicesModule,
    ValidationModule,
    CommandsHandlerModule,
    EnumSyncModule,
    EventsModule,
    /**
     * CQRS module setup for command and query handling.
     */
    CqrsModule.forRoot(),
    /**
     * Configuration module setup as global.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
