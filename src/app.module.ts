import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggingModule } from './core/interceptors/logging/logging.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './application/auth/auth.module';
import { DBModule } from './application/DB/DB.module';
import { ResourceModule } from './application/resource/resource.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'chambit_db',
      autoLoadEntities: true,
      synchronize: true, // 개발환경에서만 true
    }),
    LoggingModule,
    DBModule,
    AuthModule,
    ResourceModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
