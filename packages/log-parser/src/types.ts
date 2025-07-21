export interface ExecutiveSummary {
  text: string; // < 300 mots
}

export interface TestContext {
  scenario: string;
  date: string;
  environment: string;
  browser: string;
  [key: string]: string;
}

export interface LogError {
  type: string;
  message: string;
  stack?: string;
  lineNumber: number;
  raw: string;
}

export interface MiscInfo {
  versions: Record<string, string>;
  apiEndpoints: string[];
  testCases: string[];
  folderIds: string[];
}

export interface ParsedLog {
  summary: ExecutiveSummary;
  context: TestContext;
  errors: LogError[];
  misc: MiscInfo;
}

export interface IParsingStrategy {
  canHandle(lines: string[]): boolean;
  parse(lines: string[]): ParsedLog;
}
