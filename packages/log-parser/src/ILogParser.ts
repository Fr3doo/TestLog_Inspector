import type { ParsedLog } from './types';

export interface ILogParser {
  parseFile(path: string): Promise<ParsedLog>;
}

