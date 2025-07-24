import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';
import { tempDir } from './helpers/tempDir';
import {
  getLogs,
  getSummary,
  getContext,
  getErrorMessage,
} from './helpers/api';

import { AppModule } from '../apps/api/src/app.module';
import { ConfigService } from '../apps/api/src/common/config.service';
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
    const logPath = join(tmp.dir, 'sample.log');
    writeFileSync(logPath, 'Scenario: upload_e2e');

    const res = await request(app.getHttpServer())
      .post('/analyze')
      .attach('files', logPath)
      .expect(200);

    const logs = getLogs(res);
    expect(Array.isArray(logs)).toBe(true);
    expect(logs).toHaveLength(1);
    expect(getSummary(res)).toBeDefined();
    expect(getContext(res)).toBeDefined();
  });

  it('should keep memory usage stable during multiple uploads', async () => {
    const logPath = join(tmp.dir, 'mem.log');
    writeFileSync(logPath, 'Scenario: mem_check');

    const before = process.memoryUsage().heapUsed;

    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/analyze')
        .attach('files', logPath)
        .expect(200);
    }

    global.gc?.();
    const after = process.memoryUsage().heapUsed;
    const diffMb = (after - before) / (1024 * 1024);
    if (diffMb > 20) {
      console.warn(`Potential memory leak detected: +${diffMb.toFixed(2)} MB`);
    }
    expect(diffMb).toBeLessThan(20);
  });

  it('POST /analyze should enforce MAX_UPLOAD_SIZE', async () => {
    const config = new ConfigService();
    const oversized = Buffer.alloc(config.maxUploadSize + 1, '.');

    const res = await request(app.getHttpServer())
      .post('/analyze')
      .attach('files', oversized, 'big.log')
      .expect(400);

    const mb = Math.ceil(config.maxUploadSize / (1024 * 1024));
    expect(getErrorMessage(res)).toBe(ERR_FILE_TOO_LARGE(mb));
  });
});
