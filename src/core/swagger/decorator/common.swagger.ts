import { ApiProperty, ApiResponseOptions, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export class ApiResponseDto<T> {
  @ApiProperty({ description: '응답 코드', example: 0 })
  code: number;

  @ApiProperty({ description: '응답 메시지', example: 'SUCCESS' })
  message: string;

  @ApiProperty({ description: '응답 데이터', example: {} })
  data?: T;
}

// 성공 응답 생성 함수
export function createSuccessResponse<T>(
  status: number,
  description: string,
  responseType: any,
  exampleData?: T,
): ApiResponseOptions {
  return {
    status,
    description,
    type: responseType,
    examples: {
      success: {
        summary: '성공',
        value: { code: 0, message: 'SUCCESS', ...(exampleData && { data: exampleData }), },
      },
    },
  };
}

// Swagger 데코레이터 생성 함수
export function createSwaggerDecorator(
  summary: string,
  successResponse: ApiResponseOptions,
  errorResponses: ApiResponseOptions[] = [],
) {
  return applyDecorators(
    ApiOperation({ summary }),
    ApiResponse(successResponse),
    ...errorResponses.map(response => ApiResponse(response)),
  );
}

// Validation 에러 응답 생성 함수
export function createValidationErrorResponse(): ApiResponseOptions {
  return {
    status: 400,
    description: 'Validation 에러',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', description: 'Validation 에러 코드 (-1 ~ -6)' },
        message: { type: 'string', description: 'Validation 에러 메시지' },
      },
    },
    examples: {
      validationError: {
        summary: 'Validation 에러',
        value: { code: -2, message: '유효하지 않은 형식입니다.' },
      },
    },
  };
}

// 중복 오류 응답 생성 함수
export function createDuplicationErrorResponse(): ApiResponseOptions {
  return {
    status: 409,
    description: '중복 오류',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', description: '중복 오류 코드 (-5)' },
        message: { type: 'string', description: '중복 오류 메시지' },
      },
    },
    examples: {
      duplication: {
        summary: '중복 오류',
        value: { code: -5, message: '중복 오류' },
      },
    },
  };
}

// 인증 에러 응답 생성 함수
export function createUnauthorizedErrorResponse(): ApiResponseOptions {
  return {
    status: 401,
    description: '인증 에러',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', description: '인증 에러 코드 (-4, -10 ~ -12)' },
        message: { type: 'string', description: '인증 에러 메시지' },
      },
    },
    examples: {
      unauthorized: {
        summary: '인증 에러',
        value: { code: -10, message: '인증에 실패했습니다.' },
      },
    },
  };
}

// 사용자 없음 에러 응답 생성 함수
export function createUserNotFoundErrorResponse(): ApiResponseOptions {
  return {
    status: 404,
    description: '사용자 없음',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', description: '사용자 없음 코드 (-7)' },
        message: { type: 'string', description: '사용자 없음 메시지' },
      },
    },
    examples: {
      userNotFound: {
        summary: '사용자 없음',
        value: { code: -7, message: '사용자를 찾을 수 없습니다.' },
      },
    },
  };
}

// 서버 오류 응답 생성 함수
export function createServerErrorResponse(): ApiResponseOptions {
  return {
    status: 500,
    description: '서버 오류',
    schema: {
      type: 'object',
      properties: {
        code: { type: 'number', description: '에러 코드' },
        message: { type: 'string', description: '에러 메시지' },
      },
    },
    examples: {
      systemError: {
        summary: '서버 오류',
        value: { code: -99, message: 'SYSTEM_ERROR' },
      },
    },
  };
}
