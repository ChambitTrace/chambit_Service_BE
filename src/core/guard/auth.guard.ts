import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtUtil } from '../utils/jwt';
import { WinstonLoggerService } from '../interceptors/logging/winston-logger.service';
import { GlobalException } from '../exception/global.exception';
import { ErrorCode } from '../exception/const/error-code';
import { UserInfo } from './decorator/user.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtUtil: JwtUtil,
    private logger: WinstonLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.debug('AuthGuard: Authentication required');

    const request = context.switchToHttp().getRequest();
    const { accessToken, refreshToken } =
      await this.jwtUtil.extractTokens(request);

    if (!accessToken || !refreshToken) {
      throw new GlobalException(
        '헤더 또는 쿠키가 필요합니다.',
        401,
        ErrorCode.USER_NOT_AUTHENTICATION,
      );
    }

    try {
      const result = await this.jwtUtil.verifyToken(accessToken, refreshToken);

      if (!result.status) {
        throw new GlobalException(
          '토큰 검증에 실패했습니다.',
          401,
          ErrorCode.INVALID_TOKEN,
        );
      }

      // 새로운 액세스 토큰이 발급된 경우 응답 헤더에 추가
      if (result.newAccess) {
        const response = context.switchToHttp().getResponse();
        response.setHeader('Authorization', result.newAccess);
      }

      // 요청 객체에 사용자 정보 추가
      if (result.payload) {
        request.user = {
          uId: result.payload.uId,
          uName: result.payload.uName,
          uEmail: result.payload.uEmail,
          uRole: result.payload.uRole,
        } as UserInfo;
        this.logger.debug(`User authenticated: ${result.payload.uId}`);
      }

      return true;
    } catch (error) {
      this.logger.warn('AuthGuard: Authentication failed', error);
      throw new GlobalException(
        '인증에 실패했습니다.',
        401,
        ErrorCode.UNAUTHORIZED,
      );
    }
  }
}
