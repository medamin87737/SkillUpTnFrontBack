import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import {AuthService} from "./auth/auth.service";
import {JwtStrategy} from "./auth/jwt.strategy/jwt.strategy"; // Chemin correct

@Module({
  imports: [
    forwardRef(() => UsersModule), // Dépendance circulaire
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // Clé JWT
      signOptions: { expiresIn: '1h' }, // Expiration
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
