import { ConfigClient } from '../clients/config.client';
import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '../clients/prisma.client';

@Global()
@Module({
  imports: [],
  providers: [
    PrismaClient,
    //RedisClient,
    ConfigClient,
  ],
  exports: [
    PrismaClient,
    //RedisClient,
    ConfigClient,
  ],
})
export class ClientsModule {}
