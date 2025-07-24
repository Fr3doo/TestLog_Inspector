import { test, expect } from 'vitest';
import { DefaultStrategy } from '@parser/strategies/default-strategy';
import { JsonStrategy } from '@parser/strategies/json-strategy';
import { JunitStrategy } from '@parser/strategies/junit-strategy';
import { XmlStrategy } from '@parser/strategies/xml-strategy';

// Sample log lines for each strategy
const defaultLines = [
  'Scenario: login_flow',
  'Date: 2025-07-20',
  'Environment: staging',
  'Browser: chrome',
  'INFO: start',
  'ERROR: fail',
  'App 1.2.3',
  'https://api.example.com/login',
  'TestCase: TC01',
  'FolderID: F123',
];

test('DefaultStrategy parses plain log', () => {
  const parsed = DefaultStrategy.parse(defaultLines);
  expect(parsed.context.scenario).toBe('login_flow');
  expect(parsed.context.environment).toBe('staging');
  expect(parsed.errors).toHaveLength(1);
  expect(parsed.misc.apiEndpoints).toContain('https://api.example.com/login');
});

const jsonLines = [
  '{"level":"INFO","scenario":"upload","date":"2025"}',
  '{"level":"ERROR","message":"boom"}',
];

test('JsonStrategy parses ND-JSON sample', () => {
  const parsed = new JsonStrategy().parse(jsonLines);
  expect(parsed.context.scenario).toBe('upload');
  expect(parsed.errors[0].message).toBe('boom');
});

const junitLines = [
  '<testsuite name="suite" timestamp="2025">',
  '<testcase name="tc"><failure type="Error" message="boom">stack</failure></testcase>',
  '</testsuite>',
];

test('JunitStrategy parses XML sample', () => {
  const parsed = new JunitStrategy().parse(junitLines);
  expect(parsed.context.scenario).toBe('suite');
  expect(parsed.errors).toHaveLength(1);
  expect(parsed.errors[0].message).toContain('boom');
});

const xmlLines = [
  '<log scenario="s" date="d" environment="e" browser="b">',
  '<error type="E" message="boom">stack</error>',
  '</log>',
];

test('XmlStrategy parses custom XML', () => {
  const parsed = new XmlStrategy().parse(xmlLines);
  expect(parsed.context.scenario).toBe('s');
  expect(parsed.errors[0].type).toBe('E');
});
