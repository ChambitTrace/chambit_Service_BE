import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cluster } from '../../entity/resource/cluster';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class ClusterQuery {
  constructor(
    @InjectRepository(Cluster)
    private readonly repo: Repository<Cluster>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createCluster(payload: Pick<Cluster, 'cUid' | 'cName' | 'cRegion'>) {
    try {
      const cluster = this.repo.create({ ...payload, cCreatedAt: getSeoulTimestamp() });
      await this.repo.save(cluster);
      this.logger.debug(`ClusterQuery.createCluster success: ${payload.cName}`);
      return cluster;
    } catch (e) {
      this.logger.error('ClusterQuery.createCluster Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(cId: string) { return this.repo.findOne({ where: { cId } }); }
  findByUid(cUid: string) { return this.repo.findOne({ where: { cUid } }); }
}