import {
  LogParser,
  readFileContent,
  FileReader,
} from '@testlog-inspector/log-parser';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tempDir } from './helpers/tempDir';
import { vi } from 'vitest';

describe('LogParser', () => {
  let tmp: string;
  let cleanup: () => void;
  let dir: string;

  beforeEach(() => {
    ({ dir, cleanup } = tempDir('parser-'));
    tmp = join(dir, 'test.log');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('readFileContent returns file content', async () => {
    writeFileSync(tmp, 'abc');
    const res = await readFileContent(tmp);
    expect(res).toContain('abc');
  });

  it('should parse a nominal log file using a single read', async () => {
    const content = ['Scenario: login_flow', 'ERROR: boom'].join('\n');
    writeFileSync(tmp, content);

    const reader = new FileReader();
    const parser = new LogParser([], reader);
    const spy = vi.spyOn(reader, 'read');
    const res = await parser.parseFile(tmp);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(res.context.scenario).toBe('login_flow');
    expect(res.errors).toHaveLength(1);
  });

  it('should throw when file is corrupted', async () => {
    const parser = new LogParser([]);
    await expect(parser.parseFile('nonexistent.log')).rejects.toThrow(
      /Unable to read file/,
    );
  });

  it('should propagate read errors', async () => {
    const error = new Error('permission denied');
    const reader = {
      read: vi.fn().mockRejectedValueOnce(error),
    } as unknown as FileReader;
    const parser = new LogParser([], reader);

    await expect(parser.parseFile(tmp)).rejects.toThrow('permission denied');
  });

  it('should handle an empty log file', async () => {
    writeFileSync(tmp, '');
    const parser = new LogParser([]);
    const res = await parser.parseFile(tmp);

    expect(res.summary.text).toBe('');
    expect(res.context).toStrictEqual({
      scenario: '',
      date: '',
      environment: '',
      browser: '',
    });
    expect(res.errors).toHaveLength(0);
    expect(res.misc).toStrictEqual({
      versions: {},
      apiEndpoints: [],
      testCases: [],
      folderIds: [],
    });
  });
});
