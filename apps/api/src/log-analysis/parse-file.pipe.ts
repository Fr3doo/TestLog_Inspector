import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import type { Express } from 'express';

import { AnalyzeLogDto } from './dto/analyze-log.dto';
import { FileValidator } from './file-validator.service';

/**
 * Converts a Multer file into `AnalyzeLogDto` with validation
 * (required file, allowed extensions, max size).
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
