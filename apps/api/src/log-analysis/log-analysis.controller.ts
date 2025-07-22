import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Inject,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  FilesInterceptor,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Express } from 'express';

import { ILogAnalysisService } from './ILogAnalysisService';
import { ParsedLog } from '@testlog-inspector/log-parser';
import { ERR_NO_FILES } from '../common/error-messages';

/**
 * POST /analyze
 * -------------
 * Accepts one or more `.txt` or `.log` files via multipart-form-data
 *   field "files": Express.Multer.File[]
 *
 * Returns an array of ParsedLog (one result per file).
 */
@Controller()
export class LogAnalysisController {
  constructor(
    @Inject('ILogAnalysisService') private readonly service: ILogAnalysisService,
  ) {}

  /**
   * Multer interceptor:
   *   - field `files`
   *   - max 10 files (arbitrary)
   *   - size already limited to 50MB via global config
   */
  @Post('analyze')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 10, <MulterModuleOptions>{
      dest: join(tmpdir(), 'testlog-inspector'),
    }),
  )
  async analyze(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ParsedLog[]> {
    if (!files?.length) {
      throw new BadRequestException(ERR_NO_FILES);
    }

    const results: ParsedLog[] = [];

    for (const file of files) {
      const parsed = await this.service.analyze(file);
      results.push(parsed);
    }

    return results;
  }
}
