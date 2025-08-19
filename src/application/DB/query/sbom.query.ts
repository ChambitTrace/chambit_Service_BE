import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sbom } from '../../DB/entity/sbom';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class SbomQuery {
  constructor(
    @InjectRepository(Sbom)
    private readonly repo: Repository<Sbom>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createSbom(
    payload: Pick<Sbom, 'sSource' | 'sFormat' | 'sData' | 'sCoid'>,
  ) {
    try {
      const sbom = this.repo.create({
        ...payload,
        sGeneratedAt: getSeoulTimestamp(),
      });
      await this.repo.save(sbom);
      this.logger.debug(
        `SbomQuery.createSbom success: ${payload.sSource}/${payload.sFormat}`,
      );
      return sbom;
    } catch (e) {
      this.logger.error('SbomQuery.createSbom Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(sId: string) {
    return this.repo.findOne({ where: { sId } });
  }
  findByContainer(coId: string) {
    return this.repo.find({ where: { sCoid: coId } });
  }
}
