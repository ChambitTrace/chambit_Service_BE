import { Controller, UseGuards, UsePipes, Get, Query } from '@nestjs/common';
import {
  ApiHeader,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JsonResponse } from 'src/core/utils/json-response';
import { ResourceService } from '../service/resource.service';
import * as dto from '../dto/resource.dto';
import { User, UserInfo } from 'src/core/guard/decorator/user.decorator';
import { CustomValidationPipe } from 'src/core/pipes/validation';
import { AuthGuard } from 'src/core/guard/auth.guard';

@ApiTags('Resource')
@Controller('resource')
@UseGuards(AuthGuard)
@UsePipes(CustomValidationPipe)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Get('clusters')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer 액세스 토큰',
  })
  @ApiHeader({
    name: 'cookie',
    description: '리프레시 토큰이 포함된 쿠키',
  })
  @ApiOperation({ summary: 'Cluster 목록 조회' })
  @ApiOkResponse({ description: 'Cluster 배열' })
  async listClusters(@User() user: UserInfo) {
    //id 기준으로 조회할 수 있게 서비스 수정 필요
    const result = await this.resourceService.getClusters(user.uId);
    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  @Get('nodes')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer 액세스 토큰',
  })
  @ApiHeader({
    name: 'cookie',
    description: '리프레시 토큰이 포함된 쿠키',
  })
  @ApiOperation({ summary: 'Cluster 기준 Node 목록 조회' })
  @ApiOkResponse({ description: 'Node 배열' })
  async listNodes(
    @Query() dto: dto.getNodesByClusterRequestDto,
    @User() user: UserInfo,
  ) {
    const result = await this.resourceService.getNodesByCluster(
      dto.cid,
      user.uId,
    );

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  @Get('namespaces')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer 액세스 토큰',
  })
  @ApiHeader({
    name: 'cookie',
    description: '리프레시 토큰이 포함된 쿠키',
  })
  @ApiOperation({ summary: 'Cluster 기준 Namespace 목록 조회' })
  @ApiOkResponse({ description: 'Namespace 배열' })
  async listNamespaces(
    @Query() dto: dto.getNamespacesByClusterRequestDto,
    @User() user: UserInfo,
  ) {
    const result = await this.resourceService.getNamespacesByCluster(
      dto.cid,
      user.uId,
    );

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  // ------- Pod (by Node) -------
  @Get('pods')
  @ApiHeader({
    name: 'authorization',
    description: 'Bearer 액세스 토큰',
  })
  @ApiHeader({
    name: 'cookie',
    description: '리프레시 토큰이 포함된 쿠키',
  })
  @ApiOperation({ summary: 'Node 기준 Pod 목록 조회 (전체 반환)' })
  @ApiOkResponse({ description: 'Pod 배열' })
  async listPods(
    @Query() dto: dto.getPodsByNodeRequestDto,
    @User() user: UserInfo,
  ) {
    const result = await this.resourceService.getPodsByNode(dto.nid, user.uId);

    const response = new JsonResponse();
    response.set('data', result);

    return response.of();
  }

  // ------- Size Summary -------
  // @Get('size')
  // @ApiOperation({ summary: '리소스 카운트 요약', description: 'Cluster/Namespace/Node/Pod/Container/SBOM/Drift의 전체 개수를 반환합니다.' })
  // @ApiOkResponse({ description: '총 개수 집계' })
  // async totalSize(@Query() dto: dto.getTotalSizeRequestDto, @User() user: UserInfo) {
  //   const result = await this.resourceService.getTotalSize();

  //   const response = new JsonResponse();
  //   response.set('data', result);

  //   return response.of();
  // }
}
