import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

/**
 * Intercepteur de logging global.
 *  - Log l’URL, la méthode et la durée d’exécution.
 *  - Capture et log les erreurs non gérées.
 *
 *  Respecte la loi de Déméter : ne connaît que Request/Response.
 */
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const { method, originalUrl } = req;

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - now;
          this.logger.log(`${method} ${originalUrl} ${res.statusCode} +${ms}ms`);
        },
        error: (err) => {
          const ms = Date.now() - now;
          this.logger.error(
            `${method} ${originalUrl} ${res.statusCode ?? 500} +${ms}ms — ${err.message}`,
          );
        },
      }),
    );
  }
}
