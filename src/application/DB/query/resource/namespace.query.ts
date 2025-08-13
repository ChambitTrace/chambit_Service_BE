import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Namespace } from '../../entity/resource/namespace';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class NamespaceQuery {
  constructor(
    @InjectRepository(Namespace)
    private readonly repo: Repository<Namespace>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createNamespace(nsName: string, nsCid: string) {
    try {
      const ns = this.repo.create({ nsName, nsCid, nsCreatedAt: getSeoulTimestamp() });
      await this.repo.save(ns);
      this.logger.debug(`NamespaceQuery.createNamespace success: ${nsName}`);
      return ns;
    } catch (e) {
      this.logger.error('NamespaceQuery.createNamespace Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(nsId: string) { return this.repo.findOne({ where: { nsId } }); }
  findByName(nsName: string) { return this.repo.findOne({ where: { nsName } }); }
  findByCluster(nsCid: string) { return this.repo.find({ where: { nsCid } }); }
}