import { Injectable } from '@nestjs/common';
import { ResourceQuery } from '../../DB/query/resource.query';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';

@Injectable()
export class ResourceService {
  constructor(
    private readonly resourceQuery: ResourceQuery,
    private readonly logger: WinstonLoggerService,
  ) {}

  async checkClusterOwner(uid: string, cid: string) {
    this.logger.debug?.('ResourceService.checkClusterOwner called');

    if (!uid) {
      this.logger.error('ResourceService.checkClusterOwner: uid is required');
      throw new Error('uid is required');
    }

    try {
      return await this.resourceQuery.checkClusterOwner(uid, cid);
    } catch (error) {
      this.logger.error('ResourceService.checkClusterOwner failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getClusters(uid: string) {
    this.logger.debug?.('ResourceService.getClusters called');

    if (!uid) {
      this.logger.error('ResourceService.getClusters: uid is required');
      throw new Error('uid is required');
    }

    try {
      return await this.resourceQuery.getClusters(uid);
    } catch (error) {
      this.logger.error('ResourceService.getClusters failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getNodesByCluster(cid: string, uid: string) {
    this.logger.debug?.('ResourceService.getNodesByCluster called');
    if (!cid) {
      this.logger.error('ResourceService.getNodesByCluster: cid is required');
      throw new Error('cid is required');
    }
    if (!uid) {
      this.logger.error('ResourceService.getNodesByCluster: uid is required');
      throw new Error('uid is required');
    }
    if (!(await this.checkClusterOwner(uid, cid))) {
      this.logger.error(
        'ResourceService.getNodesByCluster: User is not the owner of the cluster',
      );
      throw new Error('User is not the owner of the cluster');
    }

    try {
      return await this.resourceQuery.getNodesByCluster(cid);
    } catch (error) {
      this.logger.error('ResourceService.getNodesByCluster failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getNamespacesByCluster(cid: string, uid: string) {
    this.logger.debug?.('ResourceService.getNamespacesByCluster called');
    if (!cid) {
      this.logger.error('ResourceService.getNodesByCluster: cid is required');
      throw new Error('cid is required');
    }
    if (!uid) {
      this.logger.error('ResourceService.getNodesByCluster: uid is required');
      throw new Error('uid is required');
    }

    if (!(await this.checkClusterOwner(uid, cid))) {
      this.logger.error(
        'ResourceService.getNodesByCluster: User is not the owner of the cluster',
      );
      throw new Error('User is not the owner of the cluster');
    }

    try {
      return await this.resourceQuery.getNamespacesByCluster(cid);
    } catch (error) {
      this.logger.error('ResourceService.getNamespacesByCluster failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getPodsByNode(nid: string, uid: string) {
    this.logger.debug?.('ResourceService.getPodsByNode called');

    if (!nid) {
      this.logger.error('ResourceService.getPodsByNode: nid is required');
      throw new Error('nid is required');
    }
    if (!uid) {
      this.logger.error('ResourceService.getPodsByNode: uid is required');
      throw new Error('uid is required');
    }
    if (!(await this.resourceQuery.checkNodeOwner(uid, nid))) {
      this.logger.error(
        'ResourceService.getPodsByNode: User is not the owner of the node',
      );
      throw new Error('User is not the owner of the node');
    }

    try {
      return await this.resourceQuery.getPodsByNode(nid);
    } catch (error) {
      this.logger.error('ResourceService.getPodsByNode failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getTotalSize() {
    this.logger.debug?.('ResourceService.getTotalSize called');
    try {
      return await this.resourceQuery.getTotalSize();
    } catch (error) {
      this.logger.error('ResourceService.getTotalSize failed');
      this.logger.error(error);
      throw error;
    }
  }
}
