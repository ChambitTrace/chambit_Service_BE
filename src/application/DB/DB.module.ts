import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { User } from './entity/user';
import { Cluster } from './entity/resource/cluster';
import { Namespace } from './entity/resource/namespace';
import { Node } from './entity/resource/node';
import { Pod } from './entity/resource/pod';
import { Container } from './entity/resource/container';
import { Sbom } from './entity/sbom';
import { Drift } from './entity/drift';
import { UserQuery } from './query/user.query';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cluster, Namespace, Node, Pod, Container, Sbom, Drift])],
  providers: [WinstonLoggerService, UserQuery],
  exports: [UserQuery, TypeOrmModule],
})
export class DBModule {}
