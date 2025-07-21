import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { LogAnalysisController } from './log-analysis.controller';
import { LogAnalysisService } from './log-analysis.service';

/**
 * Module métier dédié à l’analyse de logs.
 * Expose un endpoint POST /analyze qui accepte un upload multipart
 * et renvoie la structure ParsedLog typée.
 */
@Module({
  imports: [
    // Multer module local (hérite déjà de la config globale 50 Mo)
    MulterModule,
  ],
  controllers: [LogAnalysisController],
  providers: [LogAnalysisService],
  exports: [LogAnalysisService],
})
export class LogAnalysisModule {}
