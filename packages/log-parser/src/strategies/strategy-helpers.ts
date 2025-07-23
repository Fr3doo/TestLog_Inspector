export interface RegexMatchWithPos extends RegExpMatchArray {
  index: number;
  lineNumber: number;
}

export function execSummaryFrom(lines: string[]): string {
  const first100 = lines.slice(0, 100).join(' ');
  return first100.slice(0, 2800); // ~300 mots
}

export function matchRegex(
  lines: string[],
  regex: RegExp,
): RegexMatchWithPos[] {
  return lines.flatMap((line, i) =>
    [...line.matchAll(regex)].map(
      (m) =>
        ({
          ...(m as RegExpMatchArray),
          index: m.index ?? 0,
          lineNumber: i + 1,
        }) as RegexMatchWithPos,
    ),
  );
}
