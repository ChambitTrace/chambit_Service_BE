import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pod } from '../../entity/resource/pod';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class PodQuery {
  constructor(
    @InjectRepository(Pod)
    private readonly repo: Repository<Pod>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createPod(pName: string, pNsid: string, pNid: string, pSid?: string | null) {
    try {
      const pod = this.repo.create({
        pName, pNsid, pNid, pSid: pSid ?? null, pCreatedAt: getSeoulTimestamp(),
      });
      await this.repo.save(pod);
      this.logger.debug(`PodQuery.createPod success: ${pName}`);
      return pod;
    } catch (e) {
      this.logger.error('PodQuery.createPod Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(pId: string) { return this.repo.findOne({ where: { pId } }); }
  findByNamespace(pNsid: string) { return this.repo.find({ where: { pNsid } }); }
  findByNode(pNid: string) { return this.repo.find({ where: { pNid } }); }
}