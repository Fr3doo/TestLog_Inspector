import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FileValidationService } from '../services/file-validation.service';
import { getLogs } from '../../../../tests/helpers/api';

import { LogAnalysisModule } from '../log-analysis.module';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog';

/* ---------- Mock service & fixture ------------------ */
const parsedStub = parsedLogFixture;

const mockService = {
  analyze: jest.fn().mockResolvedValue(parsedStub),
};

describe('UploadController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Multer memory storage for tests (no tmp files)
        MulterModule.register({ storage: undefined }),
        LogAnalysisModule,
      ],
    })
      .overrideProvider('ILogAnalysisService')
      .useValue(mockService)
      .overrideProvider(FileValidationService)
      .useValue({ validate: jest.fn() })
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /upload — should return ParsedLog[] for valid files', async () => {
    const res = await request(app.getHttpServer())
      .post('/upload')
      .attach('files', Buffer.from('Scenario: login_flow'), 'sample.log')
      .expect(200);

    expect(getLogs(res)).toEqual([parsedStub]);
    expect(mockService.analyze).toHaveBeenCalledTimes(1);
    expect(mockService.analyze).toHaveBeenCalledWith(
      expect.objectContaining({ originalname: 'sample.log' }),
    );
  });

  it('POST /upload — should return 400 when no file', async () => {
    await request(app.getHttpServer()).post('/upload').expect(400);
  });
});
