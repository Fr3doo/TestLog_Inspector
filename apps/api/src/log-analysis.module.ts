import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { LogAnalysisController } from './controllers/log-analysis.controller';
import { UploadController } from './controllers/upload.controller';
import { LogAnalysisService } from './services/log-analysis.service';
import { FileValidator } from './services/file-validator.service';
import { FileValidationService } from './services/file-validation.service';
import {
  createFileValidationMiddleware,
  composeValidators,
} from './middlewares/file-validation.middleware';
import {
  LogParser,
  JsonStrategy,
  JunitStrategy,
  FileReader,
  IFileReader,
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
    { provide: 'IFileReader', useClass: FileReader },
    {
      provide: 'ILogParser',
      useFactory: (reader: IFileReader) =>
        new LogParser([new JsonStrategy(), new JunitStrategy()], reader),
      inject: ['IFileReader'],
    },
    FileValidator,
    FileValidationService,
  ],
  exports: [
    'ILogAnalysisService',
    FileValidator,
    FileValidationService,
    'IFileReader',
  ],
})
export class LogAnalysisModule implements NestModule {
  constructor(private readonly validationService: FileValidationService) {}

  configure(consumer: MiddlewareConsumer) {
    const validate = composeValidators((file) =>
      this.validationService.validate(file),
    );
    consumer
      .apply(createFileValidationMiddleware(validate))
      .forRoutes(LogAnalysisController, UploadController);
  }
}
