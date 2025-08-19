import {
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class getClustersRequestDto {
  @ApiProperty({
    description: '조회할 user의 access token',
    example: 'Barer accses token',
  }) 
  @IsNotEmpty({ message: 'Cluster ID는 필수 입력 항목입니다.' })
  @IsString({ message: 'Access token은 문자열이어야 합니다.' })
  accessToken: string;
}

export class getNodesByClusterRequestDto {
  @ApiProperty({
    description: '조회할 user의 access token',
    example: 'Barer accses token',
  })
  @IsString({ message: 'Access token은 문자열이어야 합니다.' })
  accessToken: string;

  @ApiProperty({
    description: '조회할 Cluster ID',
    example: '7306424b-8bcc-5c65-bf07-d4ff12ea6f78', // 실제 id 아닙니다
  })
  @IsNotEmpty({ message: 'Cluster ID는 필수 입력 항목입니다.' })
  @IsString({ message: 'Cluster ID는 문자열이어야 합니다.' })
  cid: string;
}

export class getNamespacesByClusterRequestDto {
  @ApiProperty({
    description: '조회할 user의 access token',
    example: 'Barer accses token',
  })
  @IsString({ message: 'Access token은 문자열이어야 합니다.' })
  accessToken: string;

  @ApiProperty({
    description: '조회할 Cluster ID',
    example: '7306424b-8bcc-5c65-bf07-d4ff12ea6f78',
  })
  @IsNotEmpty({ message: 'Cluster ID는 필수 입력 항목입니다.' })
  @IsString({ message: 'Cluster ID는 문자열이어야 합니다.' })
  cid: string;
}

export class getPodsByNodeRequestDto {
  @ApiProperty({
    description: '조회할 user의 access token',
    example: 'Barer accses token',
  })
  @IsString({ message: 'Access token은 문자열이어야 합니다.' })
  accessToken: string;

  @ApiProperty({
    description: '조회할 Node ID',
    example: 'node-1234',
  })
  @IsNotEmpty({ message: 'Node ID는 필수 입력 항목입니다.' })
  @IsString({ message: 'Node ID는 문자열이어야 합니다.' })
  nid: string;
}

export class getTotalSizeRequestDto {
  @ApiProperty({
    description: '조회할 user의 access token',
    example: 'Barer accses token',
  })
  @IsString({ message: 'Access token은 문자열이어야 합니다.' })
  accessToken: string;
}