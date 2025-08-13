import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

// GET /resource/list 쿼리 DTO
// 요구 스펙: cid | nsid | nid 중 0..1개 전달
export class ResourceListQueryDto {
  @ApiPropertyOptional({ description: 'Cluster 기준 Node 조회용 Cluster ID (cid)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'cid는 UUID 형식이어야 합니다.' })
  cid?: string;

  @ApiPropertyOptional({ description: 'Cluster 기준 Namespace 조회용 Cluster ID (nsid)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'nsid는 UUID 형식이어야 합니다.' })
  nsid?: string;

  @ApiPropertyOptional({ description: 'Node 기준 Pod 조회용 Node ID (nid)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'nid는 UUID 형식이어야 합니다.' })
  nid?: string;
}
