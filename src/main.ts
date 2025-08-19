import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './core/interceptors/logging/winston-logger.service';
import { CustomValidationPipe } from './core/pipes/validation';
import { GlobalExceptionFilter } from './core/filter/global.filter';
import { ValidationExceptionFilter } from './core/filter/validation.filter';
import { SwaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Winston 로거를 전역 로거로 설정
  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  // ValidationPipe 설정
  app.useGlobalFilters(
    new GlobalExceptionFilter(logger),
    new ValidationExceptionFilter(),
  );
  app.useGlobalPipes(new CustomValidationPipe());
  
  
  // Swagger 설정
  SwaggerConfig.setup(app);

  await app.listen(process.env.BE_PORT ?? 3000);
}
bootstrap();
