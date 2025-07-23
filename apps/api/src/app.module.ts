import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LogAnalysisModule } from './log-analysis.module';
import { LoggerInterceptor } from './common/logger.interceptor';
import { MAX_UPLOAD_SIZE } from './common/constants';

/**
 * Root module for the NestJS API.
 * - Configures Multer globally (50MB limit)
 * - Imports the LogAnalysis domain module
 * - Registers LoggerInterceptor for request/response tracing
 */
@Module({
  imports: [
    /* -------- Upload / Multer global -------- */
    MulterModule.register({
        limits: { fileSize: MAX_UPLOAD_SIZE },
    }),

    /* -------- Domain modules -------- */
    LogAnalysisModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
