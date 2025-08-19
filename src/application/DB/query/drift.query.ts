import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drift } from '../entity/drift';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class DriftQuery {
  constructor(
    @InjectRepository(Drift)
    private readonly repo: Repository<Drift>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createDrift(dCoid: string, dSid: string, dDiff: Record<string, any>) {
    try {
      const d = this.repo.create({
        dCoid,
        dSid,
        dDiff,
        dDetectedAt: getSeoulTimestamp(),
      });
      await this.repo.save(d);
      this.logger.debug(
        `DriftQuery.createDrift success: co=${dCoid} / sbom=${dSid}`,
      );
      return d;
    } catch (e) {
      this.logger.error('DriftQuery.createDrift Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(dId: string) {
    return this.repo.findOne({ where: { dId } });
  }
  findByContainer(dCoid: string) {
    return this.repo.find({ where: { dCoid } });
  }
  findBySbom(dSid: string) {
    return this.repo.find({ where: { dSid } });
  }
}
