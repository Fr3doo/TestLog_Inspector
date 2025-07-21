import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LogAnalysisModule } from './log-analysis/log-analysis.module';
import { LoggerInterceptor } from './common/logger.interceptor';

/**
 * Racine de l’API NestJS.
 * - Configure Multer globalement (50 Mo max, contrainte produit).
 * - Importe le module métier LogAnalysis.
 * - Enregistre l’intercepteur Logger pour tracer requêtes/réponses.
 */
@Module({
  imports: [
    /* -------- Upload / Multer global -------- */
    MulterModule.register({
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 Mo
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
