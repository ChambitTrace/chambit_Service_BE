import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { User } from './entity/user';
import { Cluster } from './entity/resource/cluster';
import { ClusterOwner } from './entity/resource/clusterowner';
import { Namespace } from './entity/resource/namespace';
import { Node } from './entity/resource/node';
import { Pod } from './entity/resource/pod';
import { Container } from './entity/resource/container';
import { Sbom } from './entity/sbom';
import { Drift } from './entity/drift';
import { UserQuery } from './query/user.query';
import { ResourceQuery } from './query/resource.query';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Cluster,
      Namespace,
      Node,
      Pod,
      Container,
      Sbom,
      Drift,
      ClusterOwner,
    ]),
  ],
  providers: [WinstonLoggerService, UserQuery, ResourceQuery],
  exports: [UserQuery, TypeOrmModule, ResourceQuery],
})
export class DBModule {}
