import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from '../../entity/resource/node';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class NodeQuery {
  constructor(
    @InjectRepository(Node)
    private readonly repo: Repository<Node>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createNode(payload: Pick<Node, 'nCid' | 'nName' | 'nZone'>) {
    try {
      const node = this.repo.create({ ...payload, nCreatedAt: getSeoulTimestamp() });
      await this.repo.save(node);
      this.logger.debug(`NodeQuery.createNode success: ${payload.nName}`);
      return node;
    } catch (e) {
      this.logger.error('NodeQuery.createNode Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(nId: string) { return this.repo.findOne({ where: { nId } }); }
  findByCluster(nCid: string) { return this.repo.find({ where: { nCid } }); }
}