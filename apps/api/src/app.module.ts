import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LogAnalysisModule } from './log-analysis/log-analysis.module';
import { LoggerInterceptor } from './common/logger.interceptor';

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
        limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
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
