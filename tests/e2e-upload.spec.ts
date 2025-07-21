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
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';

import { AppModule } from '../apps/api/src/app.module';

describe('Upload log file (e2e)', () => {
  let app: INestApplication;
  const tmpDir = join(__dirname, '.tmp');

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

    mkdirSync(tmpDir, { recursive: true });
  }, 30_000);

  afterAll(async () => {
    await app.close();
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('POST /analyze should return parsed JSON', async () => {
    // Prépare un petit log fictif
    const logPath = join(tmpDir, 'sample.log');
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
});
