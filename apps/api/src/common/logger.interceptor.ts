import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

/** Minimal data required for logging an HTTP request. */
interface HttpRequestInfo {
  method: string;
  url: string;
  statusCode: number;
}

/** Convert Express request/response to HttpRequestInfo. */
const toHttpRequestInfo = (req: Request, res: Response): HttpRequestInfo => ({
  method: req.method,
  url: req.originalUrl,
  statusCode: res.statusCode,
});

/**
 * Global logging interceptor.
 *  - Logs URL, method and execution time.
 *  - Captures and logs unhandled errors.
 *
 *  Follows the Law of Demeter: knows only Request/Response.
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startedAt = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - startedAt;
          const info = toHttpRequestInfo(req, res);
          this.logger.log(
            `${info.method} ${info.url} ${info.statusCode} +${ms}ms`,
          );
        },
        error: (err) => {
          const ms = Date.now() - startedAt;
          const info = toHttpRequestInfo(req, res);
          this.logger.error(
            `${info.method} ${info.url} ${info.statusCode ?? 500} +${ms}ms — ${err.message}`,
          );
        },
      }),
    );
  }
}
