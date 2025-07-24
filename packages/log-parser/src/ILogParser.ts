import type { ParsedLog } from './types.js';

export interface ILogParser {
  parseFile(path: string): Promise<ParsedLog>;
}
