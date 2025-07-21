import { IParsingStrategy, ParsedLog } from "../types";

export interface RegexMatchWithPos extends RegExpMatchArray {
  index: number;
  lineNumber: number;
}

export abstract class BaseStrategy implements IParsingStrategy {
  abstract canHandle(_lines: string[]): boolean;
  abstract parse(_lines: string[]): ParsedLog;

  protected execSummaryFrom(lines: string[]): string {
    const first100 = lines.slice(0, 100).join(" ");
    return first100.slice(0, 2800); // ~300 mots
  }

  /* small helpers factorised here (DRY) */
  protected matchRegex(lines: string[], regex: RegExp): RegexMatchWithPos[] {
    return lines.flatMap((line, i) =>
      [...line.matchAll(regex)].map((m) => ({
        ...(m as RegExpMatchArray),
        index: m.index ?? 0,
        lineNumber: i + 1,
      } as RegexMatchWithPos))
    );
  }
}
