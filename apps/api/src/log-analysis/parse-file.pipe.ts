import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import type { Express } from 'express';
import { extname } from 'node:path';

import { AnalyzeLogDto } from './dto/analyze-log.dto';
import { MAX_UPLOAD_SIZE } from '../common/constants';

/**
 * Converts a Multer file into `AnalyzeLogDto` with validation
 * (required file, allowed extensions, max size).
 */
@Injectable()
export class ParseFilePipe implements PipeTransform<Express.Multer.File, AnalyzeLogDto> {
  private readonly ALLOWED_EXT = ['.log', '.txt'];

  transform(file: Express.Multer.File | undefined): AnalyzeLogDto {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = extname(file.originalname).toLowerCase();
    if (!this.ALLOWED_EXT.includes(ext)) {
      throw new BadRequestException('Invalid file type; only .log or .txt are accepted');
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      const mb = Math.ceil(MAX_UPLOAD_SIZE / (1024 * 1024));
      throw new BadRequestException(`File exceeds the ${mb}\u00a0MB limit`);
    }

    return { filePath: file.path };
  }
}
