import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient as PrismaService } from '@prisma/client';

/**
 * PrismaClient extends PrismaService to integrate with NestJS lifecycle hooks.
 */
@Injectable()
export class PrismaClient
  extends PrismaService
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Connects to the database when the module is initialized.
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * Disconnects from the database when the module is destroyed.
   * @returns {Promise<void>}
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
