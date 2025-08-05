import { ApiProperty } from '@nestjs/swagger';
import {
  createValidationErrorResponse,
  createServerErrorResponse,
  createUserNotFoundErrorResponse,
  createDuplicationErrorResponse,
  createUnauthorizedErrorResponse,
  createSuccessResponse,
  createSwaggerDecorator,
  ApiResponseDto,
} from '../common.swagger';

export class TokenDto {
  @ApiProperty({ description: '액세스 토큰', example: 'accessToken' })
  accessToken: string;

  @ApiProperty({ description: '리프레시 토큰', example: 'refreshToken' })
  refreshToken: string;
}

export class UserInfoDto {
  @ApiProperty({ description: '유저 ID', example: 'uuid' })
  uId: string;

  @ApiProperty({ description: '유저 이름', example: 'John Doe' })
  uName: string;

  @ApiProperty({ description: '유저 이메일', example: 'john.doe@example.com' })
  uEmail: string;

  @ApiProperty({ description: '유저 역할', example: 'user' })
  uRole: string;
}

export class SignUpResponseDto extends ApiResponseDto<TokenDto> {
  @ApiProperty({ description: '토큰 정보', type: TokenDto })
  declare data: TokenDto;
}

export class LoginResponseDto extends ApiResponseDto<TokenDto> {
  @ApiProperty({ description: '토큰 정보', type: TokenDto })
  declare data: TokenDto;
}

export class LogoutResponseDto extends ApiResponseDto<void> {}

export class GetUserInfoResponseDto extends ApiResponseDto<UserInfoDto> {
  @ApiProperty({ description: '유저 정보', type: UserInfoDto })
  declare data: UserInfoDto;
}

export function SignUpSwagger() {
  return createSwaggerDecorator(
    '회원가입',
    createSuccessResponse(200, '회원가입 성공', SignUpResponseDto, {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    }),
    [
      createValidationErrorResponse(),
      createDuplicationErrorResponse(),
      createServerErrorResponse(),
    ],
  );
}

export function LoginSwagger() {
  return createSwaggerDecorator(
    '로그인',
    createSuccessResponse(200, '로그인 성공', LoginResponseDto, {
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
    }),
    [
      createValidationErrorResponse(),
      createUserNotFoundErrorResponse(),
      createUnauthorizedErrorResponse(),
      createServerErrorResponse(),
    ],
  );
}

export function LogoutSwagger() {
  return createSwaggerDecorator(
    '로그아웃',
    createSuccessResponse(200, '로그아웃 성공', LogoutResponseDto),
    [
      createUnauthorizedErrorResponse(),
      createServerErrorResponse(),
    ],
  );
}

export function GetUserInfoSwagger() {
  return createSwaggerDecorator(
    '유저 정보 조회',
    createSuccessResponse(200, '유저 정보 조회 성공', GetUserInfoResponseDto, {
      uId: '1234567890',
      uName: 'John Doe',
      uEmail: 'john.doe@example.com',
      uRole: 'user',
    }),
    [
      createUnauthorizedErrorResponse(),
      createServerErrorResponse(),
    ],
  );
}
