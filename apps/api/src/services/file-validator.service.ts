import { BadRequestException, Injectable } from '@nestjs/common';
import { extname } from 'node:path';
import type { Express } from 'express';
import type { FileFilterCallback } from 'multer';
import { ConfigService } from '../common/config.service';
import { ALLOWED_EXT } from '../common/file.constants';
import {
  ERR_FILE_TOO_LARGE,
  ERR_INVALID_FILETYPE,
} from '../common/error-messages';

/**
 * Service responsible for validating uploaded files.
 * Checks allowed extensions and maximum size from ConfigService.
 */
@Injectable()
export class FileValidator {
  constructor(private readonly config: ConfigService) {}

  private get MAX_SIZE() {
    return this.config.maxUploadSize;
  }

  validate(file: Express.Multer.File): void {
    const ext = extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXT.includes(ext as (typeof ALLOWED_EXT)[number])) {
      throw new BadRequestException(ERR_INVALID_FILETYPE);
    }

    if (file.size > this.MAX_SIZE) {
      const mb = Math.ceil(this.MAX_SIZE / (1024 * 1024));
      throw new BadRequestException(ERR_FILE_TOO_LARGE(mb));
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
    new FileValidator(new ConfigService()).validate(file);
    cb(null, true);
  } catch (err) {
    cb(err as Error);
  }
};
