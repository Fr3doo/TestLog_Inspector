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

import { ILogAnalysisService } from '../services/ILogAnalysisService.js';
import { ParsedLog } from '@testlog-inspector/log-parser';
import { ERR_NO_FILES } from '../common/error-messages.js';

/**
 * POST /upload
 * -------------
 * Accepts one or more `.txt` or `.log` files via multipart-form-data
 *   field "files": Express.Multer.File[]
 *
 * Returns an array of ParsedLog (one result per file).
 * Dedicated controller so other upload-related actions can be added
 * without bloating `LogAnalysisController`.
 */
@Controller('upload')
export class UploadController {
  constructor(
    @Inject('ILogAnalysisService') private readonly service: ILogAnalysisService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FilesInterceptor('files', 10, <MulterModuleOptions>{
      dest: join(tmpdir(), 'testlog-inspector'),
    }),
  )
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ParsedLog[]> {
    if (!files?.length) {
      throw new BadRequestException(ERR_NO_FILES);
    }

    return Promise.all(files.map((file) => this.service.analyze(file)));
  }
}
