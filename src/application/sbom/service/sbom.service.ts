import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { Sbom } from '../../DB/entity/sbom';
import { CreateSbomDto, UpdateSbomDto, ListSbomQueryDto } from '../dto/sbom.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SbomService {
  constructor(
    @InjectRepository(Sbom)
    private readonly repo: Repository<Sbom>,
  ) {}

  async list(uId: string, q: ListSbomQueryDto) {
    const page = Math.max(1, Number(q.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(q.limit ?? 20)));

    const where: FindOptionsWhere<Sbom> = {};
    if (q.source) where.sSource = q.source;
    if (q.pid) where.sPid = q.pid;

    const [rows, total] = await this.repo.findAndCount({
      where,
      order: { sGeneratedAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
      select: ['sId','sPid','sSource','sFormat','sGeneratedAt'],
    });

    return { page, limit, total, items: rows };
  }

  async getOne(uId: string, id: string) {
    return await this.repo.findOne({ where: { sId: id } });
  }

  async create(uId: string, body: CreateSbomDto) {
    const { sFormat, sData, sGeneratedAt, sPid = null } = body as any;
    if (!sFormat || !sData || sGeneratedAt === undefined) {
      throw new BadRequestException('Required: sFormat, sData, sGeneratedAt');
    }
    const row = this.repo.create({
      sFormat, sData,
      sGeneratedAt: Number(sGeneratedAt),
      sPid: sPid ?? null,
      // sSource는 파일 업로드 기반에서만 설정됨
    } as any);
    return await this.repo.save(row);
  }

  async patch(uId: string, id: string, body: UpdateSbomDto) {
    const row = await this.repo.findOne({ where: { sId: id } });
    if (!row) throw new NotFoundException('SBOM not found');

    const allowed: (keyof UpdateSbomDto)[] = ['sSource','sFormat','sData','sGeneratedAt','sPid'];
    for (const k of Object.keys(body || {}) as (keyof UpdateSbomDto)[]) {
      if (!allowed.includes(k)) continue;
      (row as any)[k] = k === 'sGeneratedAt' ? Number((body as any)[k]) : (body as any)[k];
    }
    return await this.repo.save(row);
  }

  async remove(uId: string, id: string) {
    const row = await this.repo.findOne({ where: { sId: id } });
    if (!row) throw new NotFoundException('SBOM not found');
    await this.repo.delete({ sId: id });
    return { ok: true };
  }

  private ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  /**
   * 파일 업로드 기반 생성: 파일을 {DATA_DIR}/{type}/{sId}/sbom.cdx.json.gz 에 저장하고
   * sSource를 해당 파일 절대경로로 업데이트합니다.
   */
  async createFromUpload(
    uId: string,
    meta: { type: 'build'|'runtime'; sFormat: string; sGeneratedAt: number; sPid?: string|null },
    fileBuffer: Buffer,
    sData: Record<string, any>,
  ) {
    if (!fileBuffer?.length) throw new BadRequestException('empty file');
    if (!['build','runtime'].includes(meta.type)) throw new BadRequestException('type must be build|runtime');

    // 1) 먼저 저장하여 sId 확보 (insert + returning identifiers로 단건 확정)
    const row = this.repo.create({
      sFormat: meta.sFormat,
      sGeneratedAt: Number(meta.sGeneratedAt),
      sPid: meta.sPid ?? null,
      sData,
      sSource: '',
    } as any);
    const insertRes = await this.repo.insert(row as any);
    const sId = insertRes.identifiers?.[0]?.sId as string;
    if (!sId) throw new BadRequestException('Failed to create SBOM id');

    // 2) 경로 결정 및 파일 저장
    const baseDir = process.env.DATA_DIR || '/var/app/data/sbom';
    const dir = path.join(baseDir, meta.type, sId);
    this.ensureDir(dir);
    const absPath = path.join(dir, 'sbom.cdx.json.gz');
    fs.writeFileSync(absPath, fileBuffer, { flag: 'w' });

    // 3) sSource 업데이트 및 최종 레코드 반환
    await this.repo.update({ sId }, { sSource: absPath } as any);
    const final = await this.repo.findOne({ where: { sId } });
    return final!;
  }
}