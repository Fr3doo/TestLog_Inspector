import {
  ExecutiveSummary,
  ParsedLog,
  TestContext,
  LogError,
  MiscInfo,
} from "../types";
import { BaseStrategy } from "./base-strategy";

export class DefaultStrategy extends BaseStrategy {
  canHandle(_lines: string[]): boolean {
    // fallback strategy → always true
    return true;
  }

  parse(lines: string[]): ParsedLog {
    /* 1. Résumé exécutif ---------------------------------------- */
    const summary: ExecutiveSummary = {
      text: this.execSummaryFrom(lines),
    };

    /* 2. Contexte de campagne ----------------------------------- */
    const ctx: TestContext = {
      scenario: this.extractSingle(/Scenario:\s*(.+)/i, lines),
      date: this.extractSingle(/Date:\s*(.+)/i, lines),
      environment: this.extractSingle(/Env(?:ironment)?:\s*(.+)/i, lines),
      browser: this.extractSingle(/Browser:\s*(.+)/i, lines),
    };

    /* 3. Erreurs/Exceptions ------------------------------------- */
    const errorMatches = this.matchRegex(
      lines,
      /(ERROR|Exception)\s*[:-]\s*(.+)/
    );
    const errors: LogError[] = errorMatches.map((m) => {
      const idx = m.index;
      return {
        type: m[1],
        message: m[2],
        stack: this.extractStack(lines, idx),
        lineNumber: m.lineNumber,
        raw: lines[idx - 1],
      };
    });

    /* 4. Infos diverses ----------------------------------------- */
    const versions = Object.fromEntries(
      this.matchRegex(lines, /(\w+) v?(\d+\.\d+\.\d+)/).map((m) => [
        m[1],
        m[2],
      ])
    );
    const misc: MiscInfo = {
      versions,
      apiEndpoints: this.matchRegex(lines, /(https?:\/\/[^\s]+)/).map(
        (m) => m[1]
      ),
      testCases: this.matchRegex(lines, /TestCase:\s*(\w+)/).map((m) => m[1]),
      folderIds: this.matchRegex(lines, /FolderID:\s*(\w+)/).map((m) => m[1]),
    };

    return { summary, context: ctx, errors, misc };
  }

  /* ---------- private helpers ---------- */
  private extractSingle(r: RegExp, lines: string[]): string {
    const m = lines.find((l) => r.test(l));
    return m ? m.replace(r, "$1").trim() : "";
  }

  private extractStack(lines: string[], from: number): string | undefined {
    const stackLines: string[] = [];
    for (let i = from; i < lines.length && stackLines.length < 20; i++) {
      if (/^\s+at\s/.test(lines[i])) stackLines.push(lines[i]);
      else if (stackLines.length) break;
    }
    return stackLines.length ? stackLines.join("\n") : undefined;
  }
}
