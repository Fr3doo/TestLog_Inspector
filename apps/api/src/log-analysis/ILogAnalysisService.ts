import type { Express } from 'express';
import type { ParsedLog } from '@testlog-inspector/log-parser';

export interface ILogAnalysisService {
  analyze(file: Express.Multer.File): Promise<ParsedLog>;
}
