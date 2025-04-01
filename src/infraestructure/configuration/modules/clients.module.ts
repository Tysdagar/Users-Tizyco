import { ConfigClient } from '../clients/config.client';
import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '../clients/prisma.client';
import { RedisClient } from '../clients/redis.client';

@Global()
@Module({
  providers: [PrismaClient, RedisClient, ConfigClient],
  exports: [PrismaClient, RedisClient, ConfigClient],
})
export class ClientsModule {}
