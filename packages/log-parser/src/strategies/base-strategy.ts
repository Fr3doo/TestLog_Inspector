import { IParsingStrategy, ParsedLog } from "../types";

export abstract class BaseStrategy implements IParsingStrategy {
  abstract canHandle(lines: string[]): boolean;
  abstract parse(lines: string[]): ParsedLog;

  protected execSummaryFrom(lines: string[]): string {
    const first100 = lines.slice(0, 100).join(" ");
    return first100.slice(0, 2800); // ~300 mots
  }

  /* small helpers factorised here (DRY) */
  protected matchRegex(lines: string[], regex: RegExp): RegExpMatchArray[] {
    return lines.flatMap((line, i) =>
      [...line.matchAll(regex)].map((m) => ({ ...m, lineNumber: i + 1 }))
    );
  }
}
