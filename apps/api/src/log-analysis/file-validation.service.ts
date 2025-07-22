import { Injectable, BadRequestException } from '@nestjs/common';
import type { Express } from 'express';
import { FileValidator } from './file-validator.service';
import { ERR_FILE_REQUIRED } from '../common/error-messages';

/**
 * Coordinates all checks on the uploaded file before parsing.
 * Validates presence, then delegates extension/size checks to FileValidator.
 */
@Injectable()
export class FileValidationService {
  constructor(private readonly validator: FileValidator) {}

  validate(file: Express.Multer.File): void {
    if (!file?.path) {
      throw new BadRequestException(ERR_FILE_REQUIRED);
    }
    this.validator.validate(file);
  }
}
