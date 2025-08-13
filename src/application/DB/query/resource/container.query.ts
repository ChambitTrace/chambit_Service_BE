import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Container } from '../../entity/resource/container';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';

@Injectable()
export class ContainerQuery {
  constructor(
    @InjectRepository(Container)
    private readonly repo: Repository<Container>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createContainer(payload: Pick<Container, 'coPid' | 'coName' | 'coImage' | 'coField'>) {
    try {
      const c = this.repo.create(payload);
      await this.repo.save(c);
      this.logger.debug(`ContainerQuery.createContainer success: ${payload.coName}`);
      return c;
    } catch (e) {
      this.logger.error('ContainerQuery.createContainer Failed.');
      this.logger.error(e);
      throw e;
    }
  }

  findById(coId: string) { return this.repo.findOne({ where: { coId } }); }
  findByPod(coPid: string) { return this.repo.find({ where: { coPid } }); }
}