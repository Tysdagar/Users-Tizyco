import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ValidationModule } from './infraestructure/configuration/modules/validation.module';
import { CommandsModule } from './infraestructure/configuration/modules/commands.module';
import { RepositoriesModule } from './infraestructure/configuration/modules/repositories.module';
import { EnumSyncModule } from './infraestructure/configuration/modules/enum-sync.module';
import { ServicesModule } from './infraestructure/configuration/modules/services.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './infraestructure/configuration/modules/events.module';
import { EndpointDiscoveryService } from './infraestructure/configuration/providers/endpoints.provider';
import { UseCasesModule } from './infraestructure/configuration/modules/use-cases.module';
import { ClientsModule } from './infraestructure/configuration/modules/clients.module';
import { AuthModule } from './infraestructure/configuration/modules/auth.module';

/**
 * Root application module for NestJS.
 */
@Module({
  imports: [
    UseCasesModule,
    EndpointDiscoveryService.register(),
    RepositoriesModule,
    ServicesModule,
    AuthModule,
    ClientsModule,
    EventsModule,
    ValidationModule,
    CommandsModule,
    EnumSyncModule,
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
