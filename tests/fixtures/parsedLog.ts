import { ParsedLog } from '../../packages/log-parser/src/types';

/** Minimal ParsedLog reused across tests */
export const parsedLogFixture: ParsedLog = {
  summary: { text: 'Un court résumé.' },
  context: {
    scenario: 'login',
    date: '2025-07-20',
    environment: 'staging',
    browser: 'chrome',
  },
  errors: [
    {
      type: 'ERROR',
      message: 'B issue',
      lineNumber: 12,
      raw: 'ERROR: B issue',
    },
    {
      type: 'Exception',
      message: 'A issue',
      lineNumber: 5,
      raw: 'Exception: A issue',
      stack: 'at Foo (foo.ts:1)',
    },
    {
      type: 'ERROR',
      message: 'C issue',
      lineNumber: 30,
      raw: 'ERROR: C issue',
    },
  ],
  misc: {
    versions: { app: '1.2.3' },
    apiEndpoints: ['http://api.local/v1/login'],
    testCases: ['TC01'],
    folderIds: ['F123'],
  },
};

export default parsedLogFixture;
