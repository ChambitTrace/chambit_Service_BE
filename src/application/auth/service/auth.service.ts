import { Injectable } from '@nestjs/common';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { UserQuery } from 'src/application/DB/query/user.query';
import { ErrorCode } from 'src/core/exception/const/error-code';
import { GlobalException } from 'src/core/exception/global.exception';
import { JwtUtil } from 'src/core/utils/jwt';
import { OAuthUserInfo} from 'src/core/guard/decorator/user.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly jwtUtil: JwtUtil,
    private readonly userQuery: UserQuery,
  ) {}

  async signUp(email: string, password: string) {
    try {
      const user = await this.userQuery.findUserByEmail(email);
      if (user) {
        this.logger.error(`User already exists: ${email}`);
        throw new GlobalException(
          'User already exists',
          409,
          ErrorCode.DUPLICATION,
        );
      }

      // 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userQuery.createUser(email, hashedPassword);

      // JWT 토큰 생성
      const token = await this.jwtUtil.generateToken({
        uId: newUser.uId,
        uName: newUser.uName,
        uEmail: newUser.uEmail,
        uRole: newUser.uRole,
      });

      await this.userQuery.updateUserRefreshToken(
        newUser.uId,
        token.refreshToken,
      );

      this.logger.debug(`AuthService.signUp success: ${email}`);
      return token;
    } catch (error) {
      this.logger.error('AuthService.signUp Failed.');
      this.logger.error(error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userQuery.findUserByEmail(email);
      if (!user) {
        this.logger.error(`User not found: ${email}`);
        throw new GlobalException(
          'User not found',
          404,
          ErrorCode.USER_NOT_FOUND,
        );
      }

      // 비밀번호 검증
      const isPasswordValid = await bcrypt.compare(password, user.uPassword);
      if (!isPasswordValid) {
        this.logger.error(`Invalid password: ${email}`);
        throw new GlobalException(
          'Invalid password',
          401,
          ErrorCode.USER_NOT_AUTHENTICATION,
        );
      }

      // JWT 토큰 생성
      const token = await this.jwtUtil.generateToken({
        uId: user.uId,
        uName: user.uName,
        uEmail: user.uEmail,
        uRole: user.uRole,
      });

      await this.userQuery.updateUserRefreshToken(user.uId, token.refreshToken);

      this.logger.debug(`AuthService.login success: ${email}`);
      return token;
    } catch (error) {
      this.logger.error('AuthService.login Failed.');
      this.logger.error(error);
      throw error;
    }
  }

  async logout(userId: string) {
    try {
      await this.userQuery.updateUserRefreshToken(userId, '');
    } catch (error) {
      this.logger.error('AuthService.logout Failed.');
      this.logger.error(error);
      throw error;
    }
  }

  async oauthLogin(googleUser: OAuthUserInfo) {
    try {
      let user = await this.userQuery.findUserByEmail(googleUser.email);

      if (!user) {
        this.logger.debug(
          `User not found, creating new user: ${googleUser.email}`,
        );
        user = await this.userQuery.createUser(googleUser.email, undefined);
      }

      const token = await this.jwtUtil.generateToken({
        uId: user.uId,
        uName: user.uName,
        uEmail: user.uEmail,
        uRole: user.uRole,
      });

      await this.userQuery.updateUserRefreshToken(user.uId, token.refreshToken);
      this.logger.debug(`AuthService.oauthLogin success: ${googleUser.email}`);
      return token;
    } catch (error) {
      this.logger.error('AuthService.oauthLogin Failed.');
      this.logger.error(error);
      throw error;
    }
  }
}
