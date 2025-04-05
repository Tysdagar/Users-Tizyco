import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigClient } from '../clients/config.client';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configClient: ConfigClient) => {
        const privateKey = configClient.getPrivateKey();
        return {
          privateKey,
          signOptions: { algorithm: 'RS256' },
        };
      },
      inject: [ConfigClient],
    }),
  ],
  exports: [JwtModule],
})
export class AuthModule {}
