import { Module } from '@nestjs/common';
import { DBModule } from '../DB/DB.module';
import { WinstonLoggerService } from '../../core/interceptors/logging/winston-logger.service';
import { SbomController } from './controller/sbom.controller';
import { SbomService } from './service/sbom.service';
import { JwtService } from '@nestjs/jwt';
import { JwtUtil } from '../../core/utils/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DBModule, ConfigModule.forFeature(jwtConfig)],
  controllers: [SbomController],
  providers: [WinstonLoggerService, SbomService, JwtUtil, JwtService],
})
export class SbomModule {}
