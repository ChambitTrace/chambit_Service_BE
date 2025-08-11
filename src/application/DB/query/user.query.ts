import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user';
import { WinstonLoggerService } from 'src/core/interceptors/logging/winston-logger.service';
import { getSeoulTimestamp } from 'src/core/utils/time';

@Injectable()
export class UserQuery {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: WinstonLoggerService,
  ) {}

  async createUser(email: string, password: string | undefined) {
    try {
      const user = this.userRepository.create({
        uEmail: email,
        uPassword: password,
        uCreatedAt: getSeoulTimestamp(),
      });

      await this.userRepository.save(user);

      this.logger.debug(`UserQuery.createUser success: ${email}`);
      return user;
    } catch (error) {
      this.logger.error('UserQuery.createUser Failed.');
      this.logger.error(error);
      throw error;
    }
  }

  async findUserById(uId: string) {
    return this.userRepository.findOne({ where: { uId: uId } });
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { uEmail: email } });
  }

  async updateUserRefreshToken(uId: string, refreshToken: string) {
    return this.userRepository.update(uId, { uRefreshToken: refreshToken });
  }
}
