import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  RequestTimeoutException,
  Inject,
} from '@nestjs/common';
import type { Express } from 'express';
import { ParsedLog, ILogParser } from '@testlog-inspector/log-parser';
import { FileValidationService } from './file-validation.service';
import { ILogAnalysisService } from './ILogAnalysisService';
import { ERR_PARSING_TIMEOUT } from '../common/error-messages';

@Injectable()
export class LogAnalysisService implements ILogAnalysisService {
  private readonly logger = new Logger(LogAnalysisService.name);
  private static readonly PARSER_TIMEOUT_MS = 5000;

  constructor(
    @Inject('ILogParser') private readonly parser: ILogParser,
    private readonly validator: FileValidationService,
  ) {}

  async analyze(
    file: Express.Multer.File,
    parser: ILogParser = this.parser,
  ): Promise<ParsedLog> {
    try {
      this.validator.validate(file);

      // Parse the file with a timeout and convert parser errors into HTTP 400
      try {
        const parsePromise = parser.parseFile(file.path);
        let timer!: NodeJS.Timeout;
        const timeoutPromise = new Promise<never>((_, reject) => {
          timer = setTimeout(
            () => reject(new RequestTimeoutException(ERR_PARSING_TIMEOUT)),
            LogAnalysisService.PARSER_TIMEOUT_MS,
          );
        });

        try {
          const result = (await Promise.race([
            parsePromise,
            timeoutPromise,
          ])) as ParsedLog;
          return result;
        } finally {
          clearTimeout(timer);
        }
      } catch (err) {
        if (err instanceof RequestTimeoutException) {
          throw err;
        }

        this.logger.error('Parsing failed', err as Error);
        throw new BadRequestException((err as Error).message);
      }
    } catch (err) {
      if (
        err instanceof BadRequestException ||
        err instanceof RequestTimeoutException
      ) {
        throw err;
      }

      this.logger.error('Unexpected error', err as Error);
      throw new InternalServerErrorException();
    }
  }
}
