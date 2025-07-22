import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Express } from 'express';

import { AnalyzeLogDto } from './dto/analyze-log.dto';
import { FileValidator } from './file-validator.service';

/**
 * Converts a Multer file into `AnalyzeLogDto` with extra validation:
 * - ensures the file is present
 * - checks allowed extensions (.log, .txt)
 * - checks max size (50MB, consistent with Multer)
 */
@Injectable()
export class ParseFilePipe implements PipeTransform<Express.Multer.File, AnalyzeLogDto> {
  constructor(private readonly validator: FileValidator) {}

  transform(file: Express.Multer.File | undefined): AnalyzeLogDto {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    this.validator.validate(file);

    return { filePath: file.path };
  }
}
