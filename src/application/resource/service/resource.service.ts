import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { Cluster } from '../../DB/entity/resource/cluster';
import { Namespace } from '../../DB/entity/resource/namespace';
import { Node } from '../../DB/entity/resource/node';
import { Pod } from '../../DB/entity/resource/pod';
import { Container } from '../../DB/entity/resource/container';
import { Sbom } from '../../DB/entity/sbom';
import { Drift } from '../../DB/entity/drift';

@Injectable()
export class ResourceService {
  constructor(
    private readonly logger: WinstonLoggerService,
    @InjectRepository(Cluster) private readonly clusterRepo: Repository<Cluster>,
    @InjectRepository(Namespace) private readonly namespaceRepo: Repository<Namespace>,
    @InjectRepository(Node) private readonly nodeRepo: Repository<Node>,
    @InjectRepository(Pod) private readonly podRepo: Repository<Pod>,
    @InjectRepository(Container) private readonly containerRepo: Repository<Container>,
    @InjectRepository(Sbom) private readonly sbomRepo: Repository<Sbom>,
    @InjectRepository(Drift) private readonly driftRepo: Repository<Drift>,
  ) {}

  /** 최상위 Cluster 목록 */
  async getClusters() {
    this.logger.debug('ResourceService.getClusters called');
    return this.clusterRepo.find({ order: { cCreatedAt: 'DESC' } });
  }

  /** Cluster 기준 Node 조회 */
  async getNodesByCluster(cid: string) {
    this.logger.debug(`ResourceService.getNodesByCluster cid=${cid}`);
    return this.nodeRepo.find({ where: { nCid: cid }, order: { nCreatedAt: 'DESC' } });
  }

  /** Cluster 기준 Namespace 조회 (요구 스펙상 파라미터명은 nsid이지만 실제 값은 Cluster ID) */
  async getNamespacesByCluster(clusterId: string) {
    this.logger.debug(`ResourceService.getNamespacesByCluster cid=${clusterId}`);
    return this.namespaceRepo.find({ where: { nsCid: clusterId }, order: { nsCreatedAt: 'DESC' } });
  }

  /** Node 기준 Pod 조회 (전체 반환, 페이지네이션 없음) */
  async getPodsByNode(nid: string) {
    this.logger.debug(`ResourceService.getPodsByNode nid=${nid}`);
    return this.podRepo.find({ where: { pNid: nid }, order: { pCreatedAt: 'DESC' } });
  }

  /** 전체 리소스 크기 요약 */
  async getTotalSize() {
    this.logger.debug('ResourceService.getTotalSize called');
    const [clusters, namespaces, nodes, pods, containers, sboms, drifts] = await Promise.all([
      this.clusterRepo.count(),
      this.namespaceRepo.count(),
      this.nodeRepo.count(),
      this.podRepo.count(),
      this.containerRepo.count(),
      this.sbomRepo.count(),
      this.driftRepo.count(),
    ]);

    return { clusters, namespaces, nodes, pods, containers, sboms, drifts };
  }
}
