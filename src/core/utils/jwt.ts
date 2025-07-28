import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../config/jwt.config';
import { WinstonLoggerService } from '../interceptors/logging/winston-logger.service';
import { GlobalException } from '../exception/global.exception';
import { ErrorCode } from '../exception/const/error-code';

interface JwtPayload {
  uId: string;
  uEmail: string;
  uRole: string;
}

@Injectable()
export class JwtUtil {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
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
}
