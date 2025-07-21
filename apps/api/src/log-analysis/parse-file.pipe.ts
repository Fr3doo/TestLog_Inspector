import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { extname } from 'node:path';

import { AnalyzeLogDto } from './dto/analyze-log.dto';

/**
 * Converts a Multer file into `AnalyzeLogDto` with extra validation:
 * - ensures the file is present
 * - checks allowed extensions (.log, .txt)
 * - checks max size (50MB, consistent with Multer)
 */
@Injectable()
export class ParseFilePipe implements PipeTransform<Express.Multer.File, AnalyzeLogDto> {
  private readonly MAX_SIZE = 50 * 1024 * 1024; // 50MB

  transform(file: Express.Multer.File | undefined): AnalyzeLogDto {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const validExt = ['.log', '.txt'];
    const ext = extname(file.originalname).toLowerCase();
    if (!validExt.includes(ext)) {
      throw new BadRequestException('Invalid file type; only .log or .txt are accepted');
    }

    if (file.size > this.MAX_SIZE) {
      throw new BadRequestException('File exceeds the 50 MB limit');
    }

    return { filePath: file.path };
  }
}
