import {
  ParsedLog,
  ExecutiveSummary,
  TestContext,
  LogError,
  MiscInfo,
} from "../types";
import { BaseStrategy } from "./base-strategy";

/**
 * Strategy JSON Lines / JSON Array
 * --------------------------------
 * Peut gérer :
 *   • Un fichier ND‑JSON (une ligne = un objet JSON)
 *   • Un tableau JSON de log‑objects
 *
 * Chaque objet doit a minima contenir :
 *   { level: "INFO"|"ERROR"|..., message: string, timestamp?: string, ... }
 */
export class JsonStrategy extends BaseStrategy {
  canHandle(lines: string[]): boolean {
    // Heuristique : les 3 premières lignes sont JSON valides OU le fichier entier est un tableau JSON
    const sample = lines.slice(0, 3);
    return (
      sample.every((l) => this.tryJSON(l) !== null) ||
      this.tryJSON(lines.join(""))?.[Symbol.iterator] !== undefined
    );
  }

  parse(lines: string[]): ParsedLog {
    const raw = lines.join("\n");
    const objects: Record<string, unknown>[] = this.toObjects(raw);

    /* 1. Résumé exécutif ----------------------------- */
    const summary: ExecutiveSummary = {
      text: this.execSummaryFrom(lines),
    };

    /* 2. Contexte ------------------------------------ */
    const first = objects[0] ?? {};
    const ctx: TestContext = {
      scenario: String(first["scenario"] ?? ""),
      date: String(first["date"] ?? first["timestamp"] ?? ""),
      environment: String(first["environment"] ?? first["env"] ?? ""),
      browser: String(first["browser"] ?? ""),
    };

    /* 3. Erreurs / Exceptions ------------------------ */
    const errors: LogError[] = objects
      .filter((o) => (o["level"] ?? "").toString().toUpperCase() === "ERROR")
      .map((o, idx) => ({
        type: String(o["type"] ?? "ERROR"),
        message: String(o["message"] ?? ""),
        stack: String(o["stack"] ?? ""),
        lineNumber: idx + 1,
        raw: JSON.stringify(o),
      }));

    /* 4. Infos diverses ------------------------------ */
    const versions: Record<string, string> = {};
    const apiEndpoints: string[] = [];
    const testCases: string[] = [];
    const folderIds: string[] = [];

    objects.forEach((o) => {
      if (typeof o["version"] === "string") {
        versions["app"] = o["version"];
      }
      if (typeof o["endpoint"] === "string") {
        apiEndpoints.push(o["endpoint"]);
      }
      if (typeof o["testCase"] === "string") {
        testCases.push(o["testCase"]);
      }
      if (typeof o["folderId"] === "string") {
        folderIds.push(o["folderId"]);
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
