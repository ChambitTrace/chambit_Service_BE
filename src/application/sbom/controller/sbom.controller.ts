import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiHeader, ApiTags, ApiOperation, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { JsonResponse } from 'src/core/utils/json-response';
import { AuthGuard } from 'src/core/guard/auth.guard';
import { User, UserInfo } from 'src/core/guard/decorator/user.decorator';
import { SbomService } from '../service/sbom.service';
import * as dto from '../dto/sbom.dto';

@ApiTags('SBOM')
@Controller('sbom')
@UseGuards(AuthGuard)
export class SbomController {
  constructor(private readonly sbomService: SbomService) {}

  @ApiHeader({ name: 'cookie', description: '리프레시 토큰이 포함된 쿠키' })
  @Get()
  @ApiOperation({ summary: 'SBOM 목록 조회', description: '필터와 페이지네이션으로 SBOM 리스트를 반환합니다.' })
  @ApiQuery({ name: 'page', required: false, description: '페이지 (기본 1)' })
  @ApiQuery({ name: 'limit', required: false, description: '페이지 크기 (기본 20, 최대 100)' })
  @ApiQuery({ name: 'source', required: false, description: 'sSource 필터' })
  @ApiQuery({ name: 'pid', required: false, description: 'sPid 필터' })
  @ApiOkResponse({ description: 'SBOM 배열 + 페이지 정보' })
  async list(@Query() q: dto.ListSbomQueryDto, @User() user: UserInfo) {
    const result = await this.sbomService.list(user.uId, q);
    const response = new JsonResponse();
    response.set('data', result);
    return response.of();
  }

  @ApiHeader({ name: 'cookie', description: '리프레시 토큰이 포함된 쿠키' })
  @Get(':id')
  @ApiOperation({ summary: 'SBOM 단건 조회' })
  @ApiOkResponse({ description: 'SBOM 단건' })
  async getOne(@Param() p: dto.SbomIdParamDto, @User() user: UserInfo) {
    const row = await this.sbomService.getOne(user.uId, p.id);
    if (!row) throw new NotFoundException('SBOM not found');
    const response = new JsonResponse();
    response.set('data', row);
    return response.of();
  }

  @ApiHeader({ name: 'cookie', description: '리프레시 토큰이 포함된 쿠키' })
  @Post()
  @ApiOperation({ summary: 'SBOM 생성' })
  @ApiOkResponse({ description: '생성된 SBOM' })
  async create(@Body() body: dto.CreateSbomDto, @User() user: UserInfo) {
    const saved = await this.sbomService.create(user.uId, body);
    const response = new JsonResponse();
    response.set('data', saved);
    return response.of();
  }

  @ApiHeader({ name: 'cookie', description: '리프레시 토큰이 포함된 쿠키' })
  @Patch(':id')
  @ApiOperation({ summary: 'SBOM 수정' })
  @ApiOkResponse({ description: '수정된 SBOM' })
  async patch(@Param() p: dto.SbomIdParamDto, @Body() body: dto.UpdateSbomDto, @User() user: UserInfo) {
    const saved = await this.sbomService.patch(user.uId, p.id, body);
    const response = new JsonResponse();
    response.set('data', saved);
    return response.of();
  }

  @ApiHeader({ name: 'cookie', description: '리프레시 토큰이 포함된 쿠키' })
  @Delete(':id')
  @ApiOperation({ summary: 'SBOM 삭제' })
  @ApiOkResponse({ description: '삭제 결과' })
  async remove(@Param() p: dto.SbomIdParamDto, @User() user: UserInfo) {
    await this.sbomService.remove(user.uId, p.id);
    const response = new JsonResponse();
    response.set('data', { ok: true });
    return response.of();
  }
}