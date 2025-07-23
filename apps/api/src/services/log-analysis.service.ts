import {
  Injectable,
  Logger,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import type { Express } from 'express';
import { ParsedLog, ILogParser } from '@testlog-inspector/log-parser';
import { FileValidationService } from './file-validation.service';
import { ILogAnalysisService } from './ILogAnalysisService';

@Injectable()
export class LogAnalysisService implements ILogAnalysisService {
  private readonly logger = new Logger(LogAnalysisService.name);

  constructor(
    @Inject('ILogParser') private readonly parser: ILogParser,
    private readonly validator: FileValidationService,
  ) {}

  async analyze(
    file: Express.Multer.File,
    parser: ILogParser = this.parser,
  ): Promise<ParsedLog> {
    this.validator.validate(file);

    // Parse the file and convert parser errors into HTTP 400
    try {
      return await parser.parseFile(file.path);
    } catch (err) {
      this.logger.error('Parsing failed', err as Error);
      throw new BadRequestException((err as Error).message);
    }
  }
}
