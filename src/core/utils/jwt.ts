import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { WinstonLoggerService } from '../interceptors/logging/winston-logger.service';
import { GlobalException } from '../exception/global.exception';
import { ErrorCode } from '../exception/const/error-code';
import { UserQuery } from '../../application/DB/query/user.query';

interface JwtPayload {
  uId: string;
  uName: string;
  uEmail: string;
  uRole: string;
}

@Injectable()
export class JwtUtil {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly jwtService: JwtService,
    private readonly userQuery: UserQuery,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async generateToken(
    payload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateAccessToken(payload);
    const refreshToken = await this.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  private async generateAccessToken(payload: JwtPayload): Promise<string> {
    try {
      return this.jwtService.sign(payload, {
        secret: this.config.jwtSecretKey,
        expiresIn: '1h',
      });
    } catch (error) {
      this.logger.error('JwtUtil.generateAccessToken Failed.');
      this.logger.error(error);
      throw new GlobalException(
        'Failed to generate access token',
        500,
        ErrorCode.ERROR,
      );
    }
  }

  private async generateRefreshToken(payload: JwtPayload): Promise<string> {
    try {
      return this.jwtService.sign(payload, {
        secret: this.config.jwtRefreshSecretKey,
        expiresIn: '7d',
      });
    } catch (error) {
      this.logger.error('JwtUtil.generateRefreshToken Failed.');
      this.logger.error(error);
      throw new GlobalException(
        'Failed to generate refresh token',
        500,
        ErrorCode.ERROR,
      );
    }
  }

  private async authMiddleware(accessToken: string, refreshToken: string) {
    try {
      const accessPayload = (await this.jwtService.verify(accessToken, {
        secret: this.config.jwtSecretKey,
      })) as JwtPayload;

      return { status: 'access', payload: accessPayload };
    } catch (accessError) {
      this.logger.warn(
        'Access Token invalid or expired. Trying refresh token.',
        accessError,
      );

      try {
        const refreshPayload = (await this.jwtService.verify(refreshToken, {
          secret: this.config.jwtRefreshSecretKey,
        })) as JwtPayload;

        const uId = refreshPayload.uId;
        const userData = await this.userQuery.findUserById(uId);

        if (!userData) {
          throw new GlobalException(
            '유효하지 않은 토큰입니다.',
            401,
            ErrorCode.INVALID_TOKEN,
          );
        }

        if (refreshToken !== userData.uRefreshToken) {
          this.logger.error('Refresh token mismatch.');
          throw new GlobalException(
            '유효하지 않은 토큰입니다.',
            401,
            ErrorCode.INVALID_TOKEN,
          );
        }

        const newAccessToken = await this.generateAccessToken(refreshPayload);

        return {
          status: 'refresh',
          newAccess: newAccessToken,
          newPayload: userData,
        };
      } catch (refreshError) {
        this.logger.error('Refresh Token verification failed.');
        this.logger.error(refreshError);
        throw new GlobalException(
          '토큰 검증에 실패했습니다.',
          401,
          ErrorCode.UNAUTHORIZED,
        );
      }
    }
  }

  async verifyToken(accessToken: string, refreshToken: string) {
    const result = await this.authMiddleware(accessToken, refreshToken);

    try {
      if (result.status === 'access') {
        const userData = await this.userQuery.findUserById(
          result.payload?.uId ?? '',
        );

        if (!userData || refreshToken !== userData.uRefreshToken) {
          this.logger.error('Refresh token mismatch.');
          return { status: false, payload: null };
        }

        return { status: true, payload: result.payload };
      }

      if (result.status === 'refresh') {
        return {
          status: true,
          payload: result.newPayload,
          newAccess: result.newAccess,
        };
      }

      this.logger.error('Token is not valid.');
      return { status: false, payload: null };
    } catch (error) {
      this.logger.error('JwtUtil.verifyToken Failed.');
      this.logger.error(error);
      throw new Error('JwtUtil.verifyToken Failed.');
    }
  }

  async extractTokens(
    request: any,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const authorization = request.headers.authorization;
    const cookie = request.headers.cookie;

    if (!authorization || !cookie) {
      throw new GlobalException(
        '헤더 또는 쿠키가 필요합니다.',
        401,
        ErrorCode.USER_NOT_AUTHENTICATION,
      );
    }

    const [aType, aValue] = authorization.split(' ');

    if (aType !== 'Bearer') {
      throw new GlobalException(
        '유효하지 않은 토큰입니다.',
        401,
        ErrorCode.INVALID_TOKEN,
      );
    }

    const refreshToken = cookie.split('; ').find((cookie: string) => cookie.startsWith('refreshToken='));
    const [rType, rValue] = refreshToken.split('=');

    if (!refreshToken || rType !== 'refreshToken') {
      throw new GlobalException(
        '유효하지 않은 토큰입니다.',
        401,
        ErrorCode.INVALID_TOKEN,
      );
    }

    return { accessToken: aValue, refreshToken: rValue };
  }
}
