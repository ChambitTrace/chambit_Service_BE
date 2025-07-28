import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { User } from './entity/user';
import { UserQuery } from './query/user.query';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [WinstonLoggerService, UserQuery],
  exports: [UserQuery],
})
export class DBModule {}
