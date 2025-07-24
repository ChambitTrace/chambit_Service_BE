import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './core/pipes/validation';
import { SwaggerConfig } from './config/swagger.config';
import { WinstonLoggerService } from './core/interceptors/logging/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Winston 로거를 전역 로거로 설정
  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  await app.listen(process.env.BE_PORT ?? 3000);
}
bootstrap();
