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
    type: String,
  })
  accessToken: string;

  @ApiProperty({
    description: '리프레시 토큰',
    type: String,
  })
  refreshToken: string;
}

export class UserInfoDto {
  @ApiProperty({
    description: '유저 ID',
    type: String,
  })
  uId: string;

  @ApiProperty({
    description: '유저 이름',
    type: String,
  })
  uName: string;

  @ApiProperty({
    description: '유저 이메일',
    type: String,
  })
  uEmail: string;

  @ApiProperty({
    description: '유저 역할',
    type: String,
  })
  uRole: string;
}

export class SignUpResponseDto extends ApiResponseDto<TokenDto> {
  @ApiProperty({
    description: '토큰 정보',
    type: TokenDto,
  })
  declare data: TokenDto;
}

export class LoginResponseDto extends ApiResponseDto<TokenDto> {
  @ApiProperty({
    description: '토큰 정보',
    type: TokenDto,
  })
  declare data: TokenDto;
}

export class LogoutResponseDto extends ApiResponseDto<void> {}

export class GetUserInfoResponseDto extends ApiResponseDto<UserInfoDto> {
  @ApiProperty({
    description: '유저 정보',
    type: UserInfoDto,
  })
  declare data: UserInfoDto;
}

export function SignUpSwagger() {
  return applyDecorators(
    ApiOperation({ summary: '회원가입' }),
    ApiResponse({
      status: 200,
      description: '회원가입 성공',
      type: SignUpResponseDto,
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
      type: LoginResponseDto,
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

export function LogoutSwagger() {
  return applyDecorators(
    ApiOperation({ summary: '로그아웃' }),
    ApiResponse({ status: 200, description: '로그아웃 성공' }),
    ApiResponse({
      status: 200,
      description: '로그아웃 성공',
      type: LogoutResponseDto,
      examples: {
        success: {
          summary: '성공',
          value: {
            code: 0,
            message: 'SUCCESS',
          },
        },
      },
    }),
    ApiResponse(createUnauthorizedErrorResponse()),
    ApiResponse(createServerErrorResponse()),
  );
}

export function GetUserInfoSwagger() {
  return applyDecorators(
    ApiOperation({ summary: '유저 정보 조회' }),
    ApiResponse({
      status: 200,
      description: '유저 정보 조회 성공',
      type: GetUserInfoResponseDto,
      examples: {
        success: {
          summary: '성공',
          value: {
            code: 0,
            message: 'SUCCESS',
            data: {
              uId: '1234567890',
              uName: 'John Doe',
              uEmail: 'john.doe@example.com',
              uRole: 'user',
            },
          },
        },
      },
    }),
    ApiResponse(createUnauthorizedErrorResponse()),
    ApiResponse(createServerErrorResponse()),
  );
}
