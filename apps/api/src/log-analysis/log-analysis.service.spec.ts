import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { LogAnalysisService } from './log-analysis.service';
import { LogParser, ParsedLog } from '@testlog-inspector/log-parser';

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

/* ---------- Suite de tests --------------- */
describe('LogAnalysisService', () => {
  let service: LogAnalysisService;
  let parser: MockLogParser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogAnalysisService,
        { provide: LogParser, useClass: MockLogParser },
      ],
    }).compile();

    service = module.get<LogAnalysisService>(LogAnalysisService);
    parser = module.get<LogParser>(LogParser) as unknown as MockLogParser;
  });

  it('should return ParsedLog when path is valid', async () => {
    const dto = { filePath: '/tmp/file.log' };
    const result = await service.analyze(dto);

    expect(parser.parseFile).toHaveBeenCalledWith('/tmp/file.log');
    expect(result).toEqual(dummyParsed);
  });

  it('should throw BadRequestException when filePath missing', async () => {
    // @ts-expect-error – intentionally passing empty dto
    await expect(service.analyze({})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should wrap parser errors into BadRequestException', async () => {
    parser.parseFile.mockRejectedValueOnce(new Error('corrupted'));

    await expect(
      service.analyze({ filePath: '/tmp/bad.log' }),
    ).rejects.toThrow(/corrupted/);
  });
});
