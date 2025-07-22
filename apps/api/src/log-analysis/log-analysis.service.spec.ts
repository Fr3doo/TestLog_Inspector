import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { LogAnalysisService } from './log-analysis.service';
import { ParsedLog, ILogParser } from '@testlog-inspector/log-parser';
import type { Express } from 'express';
import { FileValidator } from './file-validator.service';

/* ---------- Doubles / Fixtures ---------- */
const dummyParsed: ParsedLog = {
  summary: { text: 'dummy' },
  context: { scenario: 's', date: 'd', environment: 'e', browser: 'b' },
  errors: [],
  misc: { versions: {}, apiEndpoints: [], testCases: [], folderIds: [] },
};

class MockLogParser {
  parseFile = jest.fn().mockResolvedValue(dummyParsed);
}

class MockValidator {
  validate = jest.fn();
}

/* ---------- Suite de tests --------------- */
describe('LogAnalysisService', () => {
  let service: LogAnalysisService;
  let parser: MockLogParser;
  let validator: MockValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogAnalysisService,
        { provide: 'ILogParser', useClass: MockLogParser },
        { provide: FileValidator, useClass: MockValidator },
      ],
    }).compile();

    service = module.get<LogAnalysisService>(LogAnalysisService);
    parser = module.get<ILogParser>('ILogParser') as unknown as MockLogParser;
    validator = module.get<FileValidator>(FileValidator) as unknown as MockValidator;
  });

  it('should return ParsedLog when path is valid', async () => {
    const file = { path: '/tmp/file.log', originalname: 'file.log', size: 1 } as Express.Multer.File;
    const result = await service.analyze(file);

    expect(validator.validate).toHaveBeenCalledWith(file);
    expect(parser.parseFile).toHaveBeenCalledWith('/tmp/file.log');
    expect(result).toEqual(dummyParsed);
  });

  it('should throw BadRequestException when filePath missing', async () => {
    await expect(service.analyze({} as Express.Multer.File)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should wrap parser errors into BadRequestException', async () => {
    parser.parseFile.mockRejectedValueOnce(new Error('corrupted'));

    const file = { path: '/tmp/bad.log', originalname: 'bad.log', size: 1 } as Express.Multer.File;

    await expect(service.analyze(file)).rejects.toThrow(/corrupted/);
  });
});
