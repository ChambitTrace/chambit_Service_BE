import { Module } from '@nestjs/common';
import { DBModule } from '../DB/DB.module';
import { WinstonLoggerService } from '../../core/interceptors/logging/winston-logger.service';
import { ResourceController } from './controller/resource.controller';
import { ResourceService } from './service/resource.service';

@Module({
  imports: [DBModule],
  controllers: [ResourceController],
  providers: [WinstonLoggerService, ResourceService],
})
export class ResourceModule {}
