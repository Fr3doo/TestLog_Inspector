import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { LogAnalysisService } from './log-analysis.service';
import { ILogAnalysisService } from './ILogAnalysisService';
import { ILogParser } from '@testlog-inspector/log-parser';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog';
import type { Express } from 'express';
import { FileValidationService } from './file-validation.service';
import { ERR_INVALID_FILETYPE } from '../common/error-messages';

/* ---------- Doubles / Fixtures ---------- */
const dummyParsed = parsedLogFixture;

class MockLogParser {
  parseFile = jest.fn().mockResolvedValue(dummyParsed);
}

class MockValidationService {
  validate = jest.fn();
}

/* ---------- Suite de tests --------------- */
describe('LogAnalysisService', () => {
  let service: ILogAnalysisService;
  let parser: MockLogParser;
  let validator: MockValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ILogAnalysisService', useClass: LogAnalysisService },
        { provide: 'ILogParser', useClass: MockLogParser },
        { provide: FileValidationService, useClass: MockValidationService },
      ],
    }).compile();

    service = module.get<ILogAnalysisService>('ILogAnalysisService');
    parser = module.get<ILogParser>('ILogParser') as unknown as MockLogParser;
    validator = module.get<FileValidationService>(FileValidationService) as unknown as MockValidationService;
  });

  it('should return ParsedLog when path is valid', async () => {
    const file = { path: '/tmp/file.log', originalname: 'file.log', size: 1 } as Express.Multer.File;
    const result = await service.analyze(file);

    expect(validator.validate).toHaveBeenCalledWith(file);
    expect(parser.parseFile).toHaveBeenCalledWith('/tmp/file.log');
    expect(result).toEqual(dummyParsed);
  });

  it('should throw BadRequestException when validation fails', async () => {
    validator.validate.mockImplementationOnce(() => {
      throw new BadRequestException(ERR_INVALID_FILETYPE);
    });

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
