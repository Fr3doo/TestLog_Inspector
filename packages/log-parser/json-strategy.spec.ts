import { expect, test } from 'vitest';
import { JsonStrategy } from '@parser/strategies/json-strategy';
import type { IParsingStrategy, ParsedLog } from './src/types.js';

// Ensure class implements the interface at runtime
const strategy: IParsingStrategy = new JsonStrategy();

test('JsonStrategy canHandle ND-JSON', () => {
  const lines = [
    '{"level":"INFO","message":"start","scenario":"login","date":"2025"}',
    '{"level":"ERROR","message":"boom"}'
  ];
  expect(strategy.canHandle(lines)).toBe(true);
});

test('JsonStrategy parses ND-JSON', () => {
  const lines = [
    '{"level":"INFO","message":"start","scenario":"login","date":"2025"}',
    '{"level":"ERROR","message":"boom"}'
  ];

  const parsed: ParsedLog = strategy.parse(lines);
  expect(parsed).toHaveProperty('summary');
  expect(parsed).toHaveProperty('context');
  expect(parsed).toHaveProperty('errors');
  expect(parsed.errors.length).toBe(1);
});
