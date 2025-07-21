import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { LogAnalysisModule } from './log-analysis.module';
import { LogAnalysisService } from './log-analysis.service';
import { ParsedLog } from '@testlog-inspector/log-parser';

/* ---------- Mock service & fixture ------------------ */
const parsedStub: ParsedLog = {
  summary: { text: 'stub summary' },
  context: {
    scenario: 'login_flow',
    date: '2025‑07‑20',
    environment: 'staging',
    browser: 'chrome',
  },
  errors: [],
  misc: { versions: {}, apiEndpoints: [], testCases: [], folderIds: [] },
};

const mockService = {
  analyze: jest.fn().mockResolvedValue(parsedStub),
};

describe('LogAnalysisController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Multer memory storage for tests (no tmp files)
        MulterModule.register({ storage: undefined }),
        LogAnalysisModule,
      ],
    })
      .overrideProvider(LogAnalysisService)
      .useValue(mockService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /analyze — should return ParsedLog[] for valid upload', async () => {
    const res = await request(app.getHttpServer())
      .post('/analyze')
      .attach('files', Buffer.from('Scenario: login_flow'), 'sample.log')
      .expect(200);

    expect(res.body).toEqual([parsedStub]);
    expect(mockService.analyze).toHaveBeenCalledTimes(1);
  });

  it('POST /analyze — should return 400 when no file', async () => {
    await request(app.getHttpServer()).post('/analyze').expect(400);
  });
});
