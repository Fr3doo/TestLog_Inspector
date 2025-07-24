import type { ParsedLog } from '../../packages/log-parser/src/types.js';

interface ApiResponse {
  body: unknown;
}

export function getLogs(res: ApiResponse): ParsedLog[] {
  return res.body as ParsedLog[];
}

export function getSummary(res: ApiResponse) {
  return getLogs(res)[0]?.summary;
}

export function getContext(res: ApiResponse) {
  return getLogs(res)[0]?.context;
}

export function getErrorMessage(res: ApiResponse) {
  return (res.body as { message?: string }).message;
}
