import { Injectable } from '@nestjs/common';
import { ResourceQuery } from '../../DB/query/resource.query';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';

@Injectable()
export class ResourceService {
  constructor(
    private readonly resourceQuery: ResourceQuery,
    private readonly logger: WinstonLoggerService,
  ) {}

  async getClusters(uid: string) {
    this.logger.debug('ResourceService.getClusters called');
    try {
      return await this.resourceQuery.getClusters(uid);
    } catch (error) {
      this.logger.error('ResourceService.getClusters failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getNodesByCluster(cid: string, uid: string) {
    this.logger.debug('ResourceService.getNodesByCluster called');
    try {
      const checkClusterUser = await this.resourceQuery.checkClusterUser(
        uid,
        cid,
      );
      if (!checkClusterUser) {
        this.logger.error(
          'ResourceService.getNodesByCluster: User is not the owner of the cluster',
        );
        throw new Error('User is not the owner of the cluster');
      }

      return await this.resourceQuery.getNodesByCluster(cid);
    } catch (error) {
      this.logger.error('ResourceService.getNodesByCluster failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getNamespacesByCluster(cid: string, uid: string) {
    this.logger.debug('ResourceService.getNamespacesByCluster called');
    try {
      const checkClusterUser = await this.resourceQuery.checkClusterUser(
        uid,
        cid,
      );
      if (!checkClusterUser) {
        this.logger.error(
          'ResourceService.getNodesByCluster: User is not the owner of the cluster',
        );
        throw new Error('User is not the owner of the cluster');
      }

      return await this.resourceQuery.getNamespacesByCluster(cid);
    } catch (error) {
      this.logger.error('ResourceService.getNamespacesByCluster failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getPodsByNode(nid: string, uid: string) {
    this.logger.debug('ResourceService.getPodsByNode called');
    try {
      const checkNodeUser = await this.resourceQuery.checkNodeUser(uid, nid);
      if (!checkNodeUser) {
        this.logger.error(
          'ResourceService.getPodsByNode: User is not the owner of the node',
        );
        throw new Error('User is not the owner of the node');
      }

      return await this.resourceQuery.getPodsByNode(nid);
    } catch (error) {
      this.logger.error('ResourceService.getPodsByNode failed');
      this.logger.error(error);
      throw error;
    }
  }

  async getTotalSize() {
    this.logger.debug('ResourceService.getTotalSize called');
    try {
      return await this.resourceQuery.getTotalSize();
    } catch (error) {
      this.logger.error('ResourceService.getTotalSize failed');
      this.logger.error(error);
      throw error;
    }
  }
}
