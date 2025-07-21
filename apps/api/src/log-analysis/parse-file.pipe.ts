import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { extname } from 'node:path';

import { AnalyzeLogDto } from './dto/analyze-log.dto';

/**
 * Transforme un fichier Multer en `AnalyzeLogDto`
 * et applique des validations métier supplémentaires.
 *
 * ‑ Vérifie la présence du fichier
 * ‑ Vérifie l’extension (.log, .txt)
 * ‑ Vérifie la taille maximale (50 Mo, cohérente avec Multer)
 */
@Injectable()
export class ParseFilePipe implements PipeTransform<Express.Multer.File, AnalyzeLogDto> {
  private readonly MAX_SIZE = 50 * 1024 * 1024; // 50 Mo

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
