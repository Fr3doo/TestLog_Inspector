import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { LogAnalysisController } from './log-analysis.controller';
import { LogAnalysisService } from './log-analysis.service';
import { FileValidator } from './file-validator.service';
import { LogParser } from '@testlog-inspector/log-parser';

/**
 * Module métier dédié à l’analyse de logs.
 * Expose un endpoint POST /analyze qui accepte un upload multipart
 * et renvoie la structure ParsedLog typée.
 */
@Module({
  imports: [
    // Local Multer module (inherits the global 50MB limit)
    MulterModule,
  ],
  controllers: [LogAnalysisController],
  providers: [LogAnalysisService, LogParser, FileValidator],
  exports: [LogAnalysisService, FileValidator],
})
export class LogAnalysisModule {}
