import {
  ParsedLog,
  ExecutiveSummary,
  TestContext,
  LogError,
  MiscInfo,
  IParsingStrategy,
} from '../types.js';
import { execSummaryFrom } from './strategy-helpers.js';

/**
 * Example XmlStrategy
 * -------------------
 * Very naive XML parser to demonstrate extension of LogParser.
 * Handles logs of the form:
 *   <log scenario="s" date="d" environment="env" browser="b">
 *     <error type="T" message="m">stack</error>
 *   </log>
 */
export class XmlStrategy implements IParsingStrategy {
  canHandle(lines: string[]): boolean {
    return lines.join(' ').includes('<log');
  }

  parse(lines: string[]): ParsedLog {
    const xml = lines.join('\n');

    const ctx: TestContext = {
      scenario: xml.match(/scenario="([^"]+)"/)?.[1] ?? '',
      date: xml.match(/date="([^"]+)"/)?.[1] ?? '',
      environment: xml.match(/environment="([^"]+)"/)?.[1] ?? '',
      browser: xml.match(/browser="([^"]+)"/)?.[1] ?? '',
    };

    const errors: LogError[] = [
      ...xml.matchAll(
        /<error[^>]*type="([^"]+)"[^>]*message="([^"]+)"[^>]*>([^<]*)<\/error>/g,
      ),
    ].map((m) => ({
      type: m[1],
      message: m[2],
      stack: m[3].trim() || undefined,
      lineNumber: 1,
      raw: m[0],
    }));

    const summary: ExecutiveSummary = { text: execSummaryFrom(lines) };
    const misc: MiscInfo = {
      versions: {},
      apiEndpoints: [],
      testCases: [],
      folderIds: [],
    };
    return { summary, context: ctx, errors, misc };
  }
}
