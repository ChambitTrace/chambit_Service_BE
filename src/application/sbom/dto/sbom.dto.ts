import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsIn, IsObject, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class ListSbomQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pid?: string;
}

export class SbomIdParamDto {
  @ApiProperty()
  @IsString()
  id!: string;
}

export class CreateSbomDto {
  @ApiProperty({ description: '생성 주체/소스', example: 'runtime-agent' })
  @IsString() @IsNotEmpty()
  sSource!: string;

  @ApiProperty({ description: '포맷', example: 'CycloneDX' })
  @IsString() @IsNotEmpty()
  sFormat!: string;

  @ApiProperty({ description: 'SBOM 본문(JSON)' })
  @IsObject() @IsNotEmpty()
  sData!: Record<string, any>;

  @ApiProperty({ description: '생성 시각(epoch ms)', example: 1724100000000 })
  @Type(() => Number) @IsInt()
  sGeneratedAt!: number;

  @ApiPropertyOptional({ description: '선택적 PID(워크로드/컨테이너 식별자 등)' })
  @IsString() @IsOptional()
  sPid?: string | null;
}

export class UpdateSbomDto {
  @ApiPropertyOptional()
  @IsString() @IsOptional()
  sSource?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  sFormat?: string;

  @ApiPropertyOptional()
  @IsObject() @IsOptional()
  sData?: Record<string, any>;

  @ApiPropertyOptional()
  @Type(() => Number) @IsInt() @IsOptional()
  sGeneratedAt?: number;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  sPid?: string | null;
}