import { Module } from '@nestjs/common';
import { DBModule } from '../DB/DB.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonLoggerService } from '../../core/interceptors/logging/winston-logger.service';
import { JwtUtil } from '../../core/utils/jwt';
import jwtConfig from '../../config/jwt.config';
import googleConfig from '../../config/oauth.config';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [DBModule, ConfigModule.forFeature(jwtConfig), ConfigModule.forFeature(googleConfig)],
  controllers: [AuthController],
  providers: [
    WinstonLoggerService,
    AuthService,
    JwtService,
    JwtUtil,
    GoogleStrategy,
  ],
})
export class AuthModule {}
