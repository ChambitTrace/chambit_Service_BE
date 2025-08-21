import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { Repository } from 'typeorm';

import { Cluster } from '../../DB/entity/resource/cluster';
import { Namespace } from '../../DB/entity/resource/namespace';
import { Node } from '../../DB/entity/resource/node';
import { Pod } from '../../DB/entity/resource/pod';
import { Container } from '../../DB/entity/resource/container';
import { Sbom } from '../../DB/entity/sbom';
import { Drift } from '../../DB/entity/drift';
import { ClusterUser } from '../entity/resource/clusteruser';

@Injectable()
export class ResourceQuery {
  constructor(
    private readonly logger: WinstonLoggerService,
    @InjectRepository(Cluster)
    private readonly clusterRepo: Repository<Cluster>,
    @InjectRepository(ClusterUser)
    private readonly clusterUserRepo: Repository<ClusterUser>,
    @InjectRepository(Namespace)
    private readonly namespaceRepo: Repository<Namespace>,
    @InjectRepository(Node) private readonly nodeRepo: Repository<Node>,
    @InjectRepository(Pod) private readonly podRepo: Repository<Pod>,
    @InjectRepository(Container)
    private readonly containerRepo: Repository<Container>,
    @InjectRepository(Sbom) private readonly sbomRepo: Repository<Sbom>,
    @InjectRepository(Drift) private readonly driftRepo: Repository<Drift>,
  ) {}
  async checkClusterOwner(uid: string, cid: string) {
    this.logger.debug('ResourceQuery.checkClusterOwner called');
    if (!uid) {
      this.logger.error('ResourceQuery.checkClusterOwner: uid is required');
      throw new Error('uid is required');
    }

    const clusterUser = await this.clusterUserRepo.findOne({
      where: { cuUid: uid, cuCid: cid },
      select: ['cuUid', 'cuCid'],
    });

    if (!clusterUser) {
      this.logger.warn(`No cluster user found for uid: ${uid}, cid: ${cid}`);
      return false;
    }

    return true;
  }
  async getClusters(cuUid: string) {
    this.logger.debug('ResourceQuery.getClusters called');
    const ownedClusters = await this.clusterUserRepo.find({
      where: { cuUid },
      select: ['cuCid'],
    });

    const clusterIds = ownedClusters.map((oc) => oc.cuCid);

    return await this.clusterRepo.findByIds(clusterIds);
  }

  async getNodesByCluster(nCid: string) {
    this.logger.debug(
      `ResourceQuery.getNodesByCluster called with clusterId: ${nCid}`,
    );
    return await this.nodeRepo.find({ where: { nCid: nCid } });
  }

  async getNamespacesByCluster(nsCid: string) {
    this.logger.debug(
      `ResourceQuery.getNamespacesByCluster called with clusterId: ${nsCid}`,
    );
    return await this.namespaceRepo.find({ where: { nsCid } });
  }

  async checkNodeOwner(uid: string, nId: string) {
    this.logger.debug('ResourceQuery.checkNodeOwner called');
    if (!uid) {
      this.logger.error('ResourceQuery.checkNodeOwner: uid is required');
      throw new Error('uid is required');
    }

    const cluster = await this.nodeRepo.findOne({ where: { nId } });
    if (!cluster) {
      this.logger.warn(`No node found with nId: ${nId}`);
      return false;
    }

    const checkOwner = await this.checkClusterOwner(uid, cluster.nCid);

    if (!checkOwner) {
      this.logger.warn(`Not an owner of the cluster for node nId: ${nId}`);
      return false;
    }
    return true;
  }

  async getPodsByNode(pNid: string) {
    this.logger.debug(
      `ResourceQuery.getPodsByNode called with nodeId: ${pNid}`,
    );
    return await this.podRepo.find({ where: { pNid } });
  }

  async getTotalSize() {
    this.logger.debug('ResourceQuery.getTotalSize called');
    const containerCount = await this.containerRepo.count();
    const sbomCount = await this.sbomRepo.count();
    const driftCount = await this.driftRepo.count();
    return { containerCount, sbomCount, driftCount };
  }
}
