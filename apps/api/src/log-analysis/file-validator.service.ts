import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'node:path';
import type { Express } from 'express';
import type { FileFilterCallback } from 'multer';
import { MAX_UPLOAD_SIZE } from '../common/constants';

/**
 * Service responsible for validating uploaded files.
 * Checks allowed extensions and maximum size (configured via MAX_UPLOAD_SIZE).
 */
@Injectable()
export class FileValidator {
  private readonly MAX_SIZE = MAX_UPLOAD_SIZE;
  private readonly ALLOWED_EXT = ['.log', '.txt'];

  validate(file: Express.Multer.File): void {
    const ext = extname(file.originalname).toLowerCase();
    if (!this.ALLOWED_EXT.includes(ext)) {
      throw new BadRequestException('Invalid file type; only .log or .txt are accepted');
    }

    if (file.size > this.MAX_SIZE) {
      const mb = Math.ceil(this.MAX_SIZE / (1024 * 1024));
      throw new BadRequestException(`File exceeds the ${mb}\u00a0MB limit`);
    }
  }
}

// Helper used by Multer fileFilter
export const fileFilter = (
  _req: unknown,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  try {
    // Use a fresh validator as fileFilter runs outside DI
    new FileValidator().validate(file);
    cb(null, true);
  } catch (err) {
    cb(err as Error);
  }
};
