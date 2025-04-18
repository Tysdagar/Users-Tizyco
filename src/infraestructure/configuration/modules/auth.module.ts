import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigClient } from '../clients/config.client';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../middlewares/auth/guards/jwt-auth.guard';
import { JwtBearerStrategy } from '../middlewares/auth/strategies/jwt-bearer.strategy';
import { JwtCookieStrategy } from '../middlewares/auth/strategies/jwt-cookie.strategy';

@Module({
  imports: [
    PassportModule,
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
  providers: [JwtAuthGuard, JwtBearerStrategy, JwtCookieStrategy],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
