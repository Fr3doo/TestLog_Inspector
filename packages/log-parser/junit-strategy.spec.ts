import { expect, test } from 'vitest';
import { JunitStrategy } from '@parser/strategies/junit-strategy';
import type { IParsingStrategy, ParsedLog } from './src/types.js';

const strategy: IParsingStrategy = new JunitStrategy();

test('JunitStrategy canHandle XML reports', () => {
  const lines = [
    '<?xml version="1.0"?>',
    '<testsuite name="suite" timestamp="2025">',
    '</testsuite>'
  ];
  expect(strategy.canHandle(lines)).toBe(true);
});

test('JunitStrategy parses XML report', () => {
  const lines = [
    '<testsuite name="suite" timestamp="2025">',
    '<testcase name="tc1"><failure type="Error" message="boom">stack</failure></testcase>',
    '</testsuite>'
  ];

  const parsed: ParsedLog = strategy.parse(lines);
  expect(parsed).toHaveProperty('summary');
  expect(parsed).toHaveProperty('context');
  expect(parsed).toHaveProperty('errors');
  expect(parsed.errors.length).toBe(1);
});
