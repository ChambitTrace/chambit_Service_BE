import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { WinstonLoggerService } from '../../../core/interceptors/logging/winston-logger.service';

import { ClusterUser } from '../entity/resource/clusteruser';
import { Cluster } from '../entity/resource/cluster';
import { Namespace } from '../entity/resource/namespace';
import { Node } from '../entity/resource/node';
import { Pod } from '../entity/resource/pod';
import { Container } from '../entity/resource/container';

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
    @InjectRepository(Node)
    private readonly nodeRepo: Repository<Node>,
    @InjectRepository(Pod)
    private readonly podRepo: Repository<Pod>,
    @InjectRepository(Container)
    private readonly containerRepo: Repository<Container>,
  ) {}

  async checkClusterUser(uid: string, cid: string) {
    this.logger.debug('ResourceQuery.checkClusterUser called');
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
    if (clusterIds.length === 0) {
      return [];
    }

    return await this.clusterRepo.find({
      where: { cId: In(clusterIds) },
    });
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

  async checkNodeUser(uid: string, nId: string) {
    this.logger.debug('ResourceQuery.checkNodeUser called');

    const node = await this.nodeRepo.findOne({ where: { nId } });
    if (!node) {
      this.logger.warn(`No node found with nId: ${nId}`);
      return false;
    }

    const checkNodeUser = await this.checkClusterUser(uid, node.nCid);
    if (!checkNodeUser) {
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
    // const sbomCount = await this.sbomRepo.count();
    // const driftCount = await this.driftRepo.count();
    // return { containerCount, sbomCount, driftCount };
    return { containerCount };
  }
}
