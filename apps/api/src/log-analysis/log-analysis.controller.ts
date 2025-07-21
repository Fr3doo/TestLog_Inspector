import {
  BadRequestException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
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

import { LogAnalysisService } from './log-analysis.service';
import { AnalyzeLogDto } from './dto/analyze-log.dto';
import { ParsedLog } from '@testlog-inspector/log-parser/src/types';

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
  constructor(private readonly service: LogAnalysisService) {}

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
      fileFilter: (_req, file, cb) => {
        if (!file.originalname.match(/\.(log|txt)$/i)) {
          return cb(
            new BadRequestException('Only .log or .txt files are allowed'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async analyze(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ParsedLog[]> {
    if (!files?.length) {
      throw new BadRequestException('No files uploaded');
    }

    const results: ParsedLog[] = [];

    for (const file of files) {
      const dto: AnalyzeLogDto = { filePath: file.path };
      const parsed = await this.service.analyze(dto);
      results.push(parsed);
    }

    return results;
  }
}
