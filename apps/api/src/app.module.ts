import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LogAnalysisModule } from './log-analysis.module';
import { LoggerInterceptor } from './common/logger.interceptor';
import { ConfigModule } from './common/config.module';
import { ConfigService } from './common/config.service';

/**
 * Root module for the NestJS API.
 * - Configures Multer globally (50MB limit)
 * - Imports the LogAnalysis domain module
 * - Registers LoggerInterceptor for request/response tracing
 */
@Module({
  imports: [
    ConfigModule,
    /* -------- Upload / Multer global -------- */
    MulterModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        limits: { fileSize: config.maxUploadSize },
      }),
      inject: [ConfigService],
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
