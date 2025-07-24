import {
  ExecutiveSummary,
  ParsedLog,
  TestContext,
  LogError,
  MiscInfo,
  IParsingStrategy,
} from '../types';
import {
  execSummaryFrom,
  matchRegex,
  RegexMatchWithPos,
} from './strategy-helpers';

function extractSingle(r: RegExp, lines: string[]): string {
  const m = lines.find((l) => r.test(l));
  return m ? m.replace(r, '$1').trim() : '';
}

function extractStack(lines: string[], from: number): string | undefined {
  const stackLines: string[] = [];
  for (let i = from; i < lines.length && stackLines.length < 20; i++) {
    if (/^\s+at\s/.test(lines[i])) stackLines.push(lines[i]);
    else if (stackLines.length) break;
  }
  return stackLines.length ? stackLines.join('\n') : undefined;
}

export const DefaultStrategy: IParsingStrategy = {
  canHandle(_lines: string[]): boolean {
    // fallback strategy → always true
    return true;
  },

  parse(lines: string[]): ParsedLog {
    /* 1. Résumé exécutif ---------------------------------------- */
    const summary: ExecutiveSummary = {
      text: execSummaryFrom(lines),
    };

    /* 2. Contexte de campagne ----------------------------------- */
    const ctx: TestContext = {
      scenario: extractSingle(/Scenario:\s*(.+)/i, lines),
      date: extractSingle(/Date:\s*(.+)/i, lines),
      environment: extractSingle(/Env(?:ironment)?:\s*(.+)/i, lines),
      browser: extractSingle(/Browser:\s*(.+)/i, lines),
    };

    /* 3. Erreurs/Exceptions ------------------------------------- */
    const errorMatches = matchRegex(lines, /(ERROR|Exception)\s*[:-]\s*(.+)/g);
    const errors: LogError[] = errorMatches.map((m: RegexMatchWithPos) => {
      const idx = m.index;
      return {
        type: m[1],
        message: m[2],
        stack: extractStack(lines, idx),
        lineNumber: m.lineNumber,
        raw: lines[idx - 1],
      };
    });

    /* 4. Infos diverses ----------------------------------------- */
    const versions = Object.fromEntries(
      matchRegex(lines, /(\w+) v?(\d+\.\d+\.\d+)/g).map(
        (m: RegexMatchWithPos) => [m[1], m[2]],
      ),
    );
    const misc: MiscInfo = {
      versions,
      apiEndpoints: matchRegex(lines, /(https?:\/\/[^\s]+)/g).map(
        (m: RegexMatchWithPos) => m[1],
      ),
      testCases: matchRegex(lines, /TestCase:\s*(\w+)/g).map(
        (m: RegexMatchWithPos) => m[1],
      ),
      folderIds: matchRegex(lines, /FolderID:\s*(\w+)/g).map(
        (m: RegexMatchWithPos) => m[1],
      ),
    };

    return { summary, context: ctx, errors, misc };
  },
};
