import { expect, test } from 'vitest';
import { LogParser } from '@parser/parser';
import type { IParsingStrategy } from '@parser/types';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

class IncompleteStrategy implements IParsingStrategy {
  canHandle() {
    return true;
  }
  parse() {
    // Missing required fields like context, misc, errors
    return { summary: { text: 'oops' } } as any;
  }
}

function tempFile(name: string, content: string): string {
  const p = join(tmpdir(), name);
  writeFileSync(p, content);
  return p;
}

test('parseFile throws when strategy result is invalid', async () => {
  const path = tempFile('bad.log', 'irrelevant');
  const parser = new LogParser([new IncompleteStrategy()]);
  await expect(parser.parseFile(path)).rejects.toThrow(
    /Invalid parsed log format/,
  );
});
