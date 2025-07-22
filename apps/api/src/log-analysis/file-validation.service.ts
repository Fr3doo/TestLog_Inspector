import { Injectable, BadRequestException } from '@nestjs/common';
import type { Express } from 'express';
import { FileValidator } from './file-validator.service';

/**
 * Coordinates all checks on the uploaded file before parsing.
 * Validates presence, then delegates extension/size checks to FileValidator.
 */
@Injectable()
export class FileValidationService {
  constructor(private readonly validator: FileValidator) {}

  validate(file: Express.Multer.File): void {
    if (!file?.path) {
      throw new BadRequestException('file is required');
    }
    this.validator.validate(file);
  }
}
