import { Module } from '@nestjs/common';
import { DBModule } from '../DB/DB.module';
import { WinstonLoggerService } from '../../core/interceptors/logging/winston-logger.service';
import { ResourceController } from './controller/resource.controller';
import { ResourceService } from './service/resource.service';
import { JwtService } from '@nestjs/jwt';
import { JwtUtil } from '../../core/utils/jwt';
import jwtConfig from '../../config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DBModule, ConfigModule.forFeature(jwtConfig)],
  controllers: [ResourceController],
  providers: [WinstonLoggerService, ResourceService, JwtUtil, JwtService],
})
export class ResourceModule {}
