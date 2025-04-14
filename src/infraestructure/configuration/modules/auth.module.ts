import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigClient } from '../clients/config.client';
import { PassportModule } from '@nestjs/passport';
import {
  JwtAuthGuard,
  JwtStrategy,
} from '../middlewares/jwt-auth-guard.middleware';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configClient: ConfigClient) => {
        const privateKey = configClient.getPrivateKey();
        return {
          privateKey: privateKey,
          signOptions: { algorithm: 'RS256' },
        };
      },
      inject: [ConfigClient],
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
