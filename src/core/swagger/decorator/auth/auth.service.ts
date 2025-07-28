import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
import {
  createValidationErrorResponse,
  createServerErrorResponse,
  createUserNotFoundErrorResponse,
  createDuplicationErrorResponse,
  createUnauthorizedErrorResponse,
  ApiResponseDto,
} from '../common.swagger';

export class TokenDto {
  @ApiProperty({
    description: '액세스 토큰',
    example: 'accessToken',
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
    example: 'refreshToken',
  })
  refreshToken: string;
}

export class TokenResponse extends ApiResponseDto<TokenDto> {
  @ApiProperty({
    description: '토큰 정보',
    type: TokenDto,
  })
  declare data: TokenDto;
}

export function SignUpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: '회원가입' }),
    ApiResponse({
      status: 200,
      description: '회원가입 성공',
      type: TokenResponse,
      examples: {
        success: {
          summary: '성공',
          value: {
            code: 0,
            message: 'SUCCESS',
            data: { accessToken: 'accessToken', refreshToken: 'refreshToken' },
          },
        },
      },
    }),
    ApiResponse(createValidationErrorResponse()),
    ApiResponse(createDuplicationErrorResponse()),
    ApiResponse(createServerErrorResponse()),
  );
}

export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({ summary: '로그인' }),
    ApiResponse({
      status: 200,
      description: '로그인 성공',
      type: TokenResponse,
      examples: {
        success: {
          summary: '성공',
          value: {
            code: 0,
            message: 'SUCCESS',
            data: { accessToken: 'accessToken', refreshToken: 'refreshToken' },
          },
        },
      },
    }),
    ApiResponse(createValidationErrorResponse()),
    ApiResponse(createUserNotFoundErrorResponse()),
    ApiResponse(createUnauthorizedErrorResponse()),
    ApiResponse(createServerErrorResponse()),
  );
}
