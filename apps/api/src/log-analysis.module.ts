import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { LogAnalysisController } from './controllers/log-analysis.controller';
import { UploadController } from './controllers/upload.controller';
import { LogAnalysisService } from './services/log-analysis.service';
import { FileValidator } from './services/file-validator.service';
import { FileValidationService } from './services/file-validation.service';
import {
  LogParser,
  JsonStrategy,
  JunitStrategy,
} from '@testlog-inspector/log-parser';

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
  controllers: [LogAnalysisController, UploadController],
  providers: [
    { provide: 'ILogAnalysisService', useClass: LogAnalysisService },
    {
      provide: 'ILogParser',
      useFactory: () =>
        new LogParser([new JsonStrategy(), new JunitStrategy()]),
    },
    FileValidator,
    FileValidationService,
  ],
  exports: ['ILogAnalysisService', FileValidator, FileValidationService],
})
export class LogAnalysisModule {}
