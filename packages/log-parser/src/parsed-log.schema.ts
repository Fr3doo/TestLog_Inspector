import { z } from 'zod';
import type { ParsedLog } from './types';

export const parsedLogSchema = z.object({
  summary: z.object({
    text: z.string(),
  }),
  context: z.object({
    scenario: z.string(),
    date: z.string(),
    environment: z.string(),
    browser: z.string(),
  }),
  errors: z.array(
    z.object({
      type: z.string(),
      message: z.string(),
      stack: z.string().optional(),
      lineNumber: z.number(),
      raw: z.string(),
    }),
  ),
  misc: z.object({
    versions: z.record(z.string(), z.string()),
    apiEndpoints: z.array(z.string()),
    testCases: z.array(z.string()),
    folderIds: z.array(z.string()),
  }),
});

export function validateParsedLog(data: unknown): ParsedLog {
  return parsedLogSchema.parse(data) as ParsedLog;
}
