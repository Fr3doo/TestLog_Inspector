/**
 * Test e2e (Jest + Supertest)
 * ---------------------------
 * Démarre l’application NestJS complète sur un port aléatoire
 * puis envoie un upload multipart pour vérifier la chaîne
 * complète (Multer ➜ Service ➜ Parser ➜ Réponse JSON).
 */

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { tempDir } from './helpers/tempDir';

import { AppModule } from '../apps/api/src/app.module';
import { MAX_UPLOAD_SIZE } from '../apps/api/src/common/constants';
import { ERR_FILE_TOO_LARGE } from '../apps/api/src/common/error-messages';

describe('Upload log file (e2e)', () => {
  let app: INestApplication;
  let tmp: { dir: string; cleanup: () => void };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();

    tmp = tempDir('upload-e2e-');
  }, 30_000);

  afterAll(async () => {
    await app.close();
    tmp.cleanup();
  });

  it('POST /analyze should return parsed JSON', async () => {
    // Prépare un petit log fictif
    const logPath = join(tmp.dir, 'sample.log');
    writeFileSync(
      logPath,
      `Scenario: upload_e2e
Date: 2025-07-20
Environment: ci
Browser: headless`,
    );

    const res = await request(app.getHttpServer())
      .post('/analyze')
      .attach('files', logPath)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('summary');
    expect(res.body[0]).toHaveProperty('context');
  });

  it('POST /analyze should enforce MAX_UPLOAD_SIZE', async () => {
    const oversized = Buffer.alloc(MAX_UPLOAD_SIZE + 1, '.');

    const res = await request(app.getHttpServer())
      .post('/analyze')
      .attach('files', oversized, 'big.log')
      .expect(400);

    const mb = Math.ceil(MAX_UPLOAD_SIZE / (1024 * 1024));
    expect(res.body.message).toBe(ERR_FILE_TOO_LARGE(mb));
  });
});
