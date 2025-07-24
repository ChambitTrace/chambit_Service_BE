import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { WinstonLoggerService } from './winston-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const startTime = Date.now();

    // 요청 로깅
    this.logger.log(`Incoming Request: ${method} ${url} from ${ip}`, 'HTTP');

    if (userAgent) {
      this.logger.debug(`User-Agent: ${userAgent}`, 'HTTP');
    }

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        // 성공 응답 로깅
        this.logger.log(
          `Outgoing Response: ${method} ${url} - ${statusCode} (${responseTime}ms)`,
          'HTTP',
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - startTime;
        // 에러 로깅
        this.logger.error(
          `Request failed: ${method} ${url} - ${error.status || 500} (${responseTime}ms)`,
          error.stack,
          'HTTP',
        );
        throw error;
      }),
    );
  }
}
