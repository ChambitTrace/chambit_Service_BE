import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { ResourceService } from '../service/resource.service';

@ApiTags('Resource')
@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  // ------- Cluster -------
  @Get('clusters')
  @ApiOperation({ summary: 'Cluster 목록 조회' })
  @ApiOkResponse({ description: 'Cluster 배열' })
  async listClusters() {
    return { type: 'cluster', items: await this.resourceService.getClusters() };
  }

  // ------- Node (by Cluster) -------
  @Get('nodes')
  @ApiOperation({ summary: 'Cluster 기준 Node 목록 조회' })
  @ApiQuery({ name: 'cid', required: true, description: 'Cluster ID' })
  @ApiOkResponse({ description: 'Node 배열' })
  async listNodes(@Query('cid') cid: string) {
    return { type: 'node', items: await this.resourceService.getNodesByCluster(cid) };
  }

  // ------- Namespace (by Cluster) -------
  @Get('namespaces')
  @ApiOperation({ summary: 'Cluster 기준 Namespace 목록 조회' })
  @ApiQuery({ name: 'cid', required: true, description: 'Cluster ID' })
  @ApiOkResponse({ description: 'Namespace 배열' })
  async listNamespaces(@Query('cid') cid: string) {
    return { type: 'namespace', items: await this.resourceService.getNamespacesByCluster(cid) };
  }

  // ------- Pod (by Node) -------
  @Get('pods')
  @ApiOperation({ summary: 'Node 기준 Pod 목록 조회 (전체 반환)' })
  @ApiQuery({ name: 'nid', required: true, description: 'Node ID' })
  @ApiOkResponse({ description: 'Pod 배열' })
  async listPods(
    @Query('nid') nid: string,
  ) {
    const items = await this.resourceService.getPodsByNode(nid);
    return { type: 'pod', items };
  }

  // ------- Size Summary -------
  @Get('size')
  @ApiOperation({ summary: '리소스 카운트 요약', description: 'Cluster/Namespace/Node/Pod/Container/SBOM/Drift의 전체 개수를 반환합니다.' })
  @ApiOkResponse({ description: '총 개수 집계' })
  async totalSize() {
    return await this.resourceService.getTotalSize();
  }
}
