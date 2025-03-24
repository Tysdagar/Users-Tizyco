import { ConfigClient } from '../clients/config.client';
import { EmailClient } from '../clients/email.client';
import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '../clients/prisma.client';
import { ENCRYPT_SERVICE } from 'src/domain/common/interfaces/encrypt-service.interface';
import { EncryptService } from 'src/infraestructure/services/encrypt.service';
import { SERIALIZE_SERVICE } from 'src/domain/common/interfaces/serialize-service.interface';
import { SerializeService } from 'src/infraestructure/services/serialize.service';
import { RedisClient } from '../clients/redis.client';
import { DataTransformationService } from 'src/infraestructure/services/data-transform.service';
import { EmailService } from 'src/application/services/email.service';

/**
 * The `ServicesModule` is a global module that centralizes the registration of shared services,
 * making them available across the application without needing explicit imports in other modules.
 *
 * This module provides essential utilities like password management, encryption, email handling,
 * data transformation, and authentication token generation.
 */
@Global()
@Module({
  /**
   * Dependencies required by the `ServicesModule`.
   */
  imports: [
    /**
     * The `AuthModule` is imported to provide authentication-related dependencies.
     */
  ],
  providers: [
    // Shared clients and services
    PrismaClient,
    RedisClient,
    ConfigClient,
    DataTransformationService,

    /**
     * The `EmailService` is provided using the `EmailClient` implementation.
     * This service is responsible for handling email communication.
     */
    { provide: EmailService, useClass: EmailClient },

    /**
     * The `ENCRYPT_SERVICE` is provided using the `EncryptService` implementation.
     * This service handles encryption and decryption operations.
     */
    { provide: ENCRYPT_SERVICE, useClass: EncryptService },

    /**
     * The `SERIALIZE_SERVICE` is provided using the `SerializeService` implementation.
     * This service is responsible for serializing and deserializing data.
     */
    { provide: SERIALIZE_SERVICE, useClass: SerializeService },
  ],
  exports: [
    /**
     * Exported services and clients to make them available globally in the application.
     */
    PrismaClient,
    ConfigClient,
    RedisClient,
    DataTransformationService,
    EmailService,
    ENCRYPT_SERVICE,
    SERIALIZE_SERVICE,
  ],
})
export class ServicesModule {}
