import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { LogAnalysisController } from './controllers/log-analysis.controller.js';
import { UploadController } from './controllers/upload.controller.js';
import { LogAnalysisService } from './services/log-analysis.service.js';
import { FileValidator } from './services/file-validator.service.js';
import { FileValidationService } from './services/file-validation.service.js';
import { ConfigModule } from './common/config.module.js';
import {
  createFileValidationMiddleware,
  composeValidators,
} from './middlewares/file-validation.middleware.js';
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
    ConfigModule,
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
