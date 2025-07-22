import { expect, test, vi } from 'vitest';
import { LogParser } from '@parser/parser';
import { JsonStrategy } from '@parser/strategies/json-strategy';
import { JunitStrategy } from '@parser/strategies/junit-strategy';
import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function tempFile(name: string, content: string): string {
  const p = join(tmpdir(), name);
  writeFileSync(p, content);
  return p;
}

test('LogParser selects JsonStrategy', async () => {
  const jsonPath = tempFile('log.json',
    '{"level":"INFO","message":"start"}\n{"level":"ERROR","message":"fail"}');
  const json = new JsonStrategy();
  const junit = new JunitStrategy();
  const parser = new LogParser([json, junit]);
  const spy = vi.spyOn(json, 'parse');
  const result = await parser.parseFile(jsonPath);
  expect(spy).toHaveBeenCalled();
  expect(result.errors.length).toBe(1);
});

test('LogParser selects JunitStrategy', async () => {
  const xmlPath = tempFile('report.xml',
    '<testsuite name="s" timestamp="t"><testcase name="a"><failure type="e" message="m">s</failure></testcase></testsuite>');
  const json = new JsonStrategy();
  const junit = new JunitStrategy();
  const parser = new LogParser([json, junit]);
  const spy = vi.spyOn(junit, 'parse');
  const result = await parser.parseFile(xmlPath);
  expect(spy).toHaveBeenCalled();
  expect(result.errors.length).toBe(1);
});
