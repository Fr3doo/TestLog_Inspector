import { expect, test, vi } from 'vitest';
import { LogParser } from '@parser/parser';
import { XmlStrategy } from '@parser/strategies/xml-strategy';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function tempFile(name: string, content: string): string {
  const p = join(tmpdir(), name);
  writeFileSync(p, content);
  return p;
}

test('registers and uses XmlStrategy', async () => {
  const xmlPath = tempFile(
    'sample.xml',
    '<log scenario="s" date="d" environment="e" browser="b"><error type="E" message="boom">stack</error></log>'
  );
  const xml = new XmlStrategy();
  const parser = new LogParser();
  parser.registerStrategy(xml);
  const spy = vi.spyOn(xml, 'parse');
  const result = await parser.parseFile(xmlPath);
  expect(spy).toHaveBeenCalled();
  expect(result.context.scenario).toBe('s');
  expect(result.errors.length).toBe(1);
});
