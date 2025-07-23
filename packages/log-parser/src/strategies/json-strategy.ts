import {
  ParsedLog,
  ExecutiveSummary,
  TestContext,
  LogError,
  MiscInfo,
  IParsingStrategy,
} from '../types';
import { execSummaryFrom } from './strategy-helpers';

/**
 * Strategy JSON Lines / JSON Array
 * --------------------------------
 * Can handle:
 *   - A ND-JSON file (one line = a JSON object)
 *   - A JSON array of log objects
 *
 * Each object must at least contain:
 *   { level: "INFO"|"ERROR"|..., message: string, timestamp?: string, ... }
 */
export class JsonStrategy implements IParsingStrategy {
  canHandle(lines: string[]): boolean {
    // Heuristic: first 3 lines are valid JSON or the whole file is a JSON array
    const sample = lines.slice(0, 3);
    return (
      sample.every((l) => this.tryJSON(l) !== null) ||
      this.tryJSON(lines.join(''))?.[Symbol.iterator] !== undefined
    );
  }

  parse(lines: string[]): ParsedLog {
    const raw = lines.join('\n');
    const objects: Record<string, unknown>[] = this.toObjects(raw);

    /* 1. Résumé exécutif ----------------------------- */
    const summary: ExecutiveSummary = {
      text: execSummaryFrom(lines),
    };

    /* 2. Contexte ------------------------------------ */
    const first = objects[0] ?? {};
    const ctx: TestContext = {
      scenario: String(first['scenario'] ?? ''),
      date: String(first['date'] ?? first['timestamp'] ?? ''),
      environment: String(first['environment'] ?? first['env'] ?? ''),
      browser: String(first['browser'] ?? ''),
    };

    /* 3. Erreurs / Exceptions ------------------------ */
    const errors: LogError[] = objects
      .filter((o) => (o['level'] ?? '').toString().toUpperCase() === 'ERROR')
      .map((o, idx) => ({
        type: String(o['type'] ?? 'ERROR'),
        message: String(o['message'] ?? ''),
        stack: String(o['stack'] ?? ''),
        lineNumber: idx + 1,
        raw: JSON.stringify(o),
      }));

    /* 4. Infos diverses ------------------------------ */
    const versions: Record<string, string> = {};
    const apiEndpoints: string[] = [];
    const testCases: string[] = [];
    const folderIds: string[] = [];

    objects.forEach((o) => {
      if (typeof o['version'] === 'string') {
        versions['app'] = o['version'];
      }
      if (typeof o['endpoint'] === 'string') {
        apiEndpoints.push(o['endpoint']);
      }
      if (typeof o['testCase'] === 'string') {
        testCases.push(o['testCase']);
      }
      if (typeof o['folderId'] === 'string') {
        folderIds.push(o['folderId']);
      }
    });

    const misc: MiscInfo = {
      versions,
      apiEndpoints,
      testCases,
      folderIds,
    };

    return { summary, context: ctx, errors, misc };
  }

  /* -------------- helpers ---------------- */

  private tryJSON(str: string): any | null {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  private toObjects(raw: string): Record<string, unknown>[] {
    const parsed = this.tryJSON(raw);
    if (Array.isArray(parsed)) return parsed as Record<string, unknown>[];

    // ND‑JSON
    return raw
      .split(/\r?\n/)
      .map((l) => this.tryJSON(l))
      .filter((v): v is Record<string, unknown> => v !== null);
  }
}
