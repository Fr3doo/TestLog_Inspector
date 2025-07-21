/**
 * Strategy JUnit XML
 * ------------------
 * Analyse les rapports JUnit produits par, par ex., Cypress, Jest‑JUnit,
 * Surefire, Robot Framework… sans dépendance XML externe (parse naïf via RegExp).
 *
 * Hypothèses :
 *   • <testsuite> contient les attributs name, timestamp
 *   • <properties><property name="env" value="staging"/>…</properties> optionnel
 *   • Chaque <testcase> peut avoir <failure type="" message="">Stack…</failure>
 */

import {
  ParsedLog,
  ExecutiveSummary,
  TestContext,
  LogError,
  MiscInfo,
} from "../types";
import { BaseStrategy } from "./base-strategy";

export class JunitStrategy extends BaseStrategy {
  canHandle(lines: string[]): boolean {
    // Détection simple : présence d’une balise <testsuite
    return lines.slice(0, 10).some((l) => /<testsuite\b/i.test(l));
  }

  parse(lines: string[]): ParsedLog {
    const xml = lines.join("\n");

    /* 1. Résumé exécutif ------------------------------ */
    const summary: ExecutiveSummary = { text: this.execSummaryFrom(lines) };

    /* 2. Contexte ------------------------------------- */
    const suiteMatch =
      xml.match(/<testsuite[^>]*name="([^"]+)"[^>]*timestamp="([^"]+)"/i) ??
      [];
    const scenario = suiteMatch[1] ?? "";
    const date = suiteMatch[2] ?? "";

    const envMatch = xml.match(
      /<property\s+name="(?:env|environment)"\s+value="([^"]+)"/i
    );
    const browserMatch = xml.match(
      /<property\s+name="browser"\s+value="([^"]+)"/i
    );

    const ctx: TestContext = {
      scenario,
      date,
      environment: envMatch?.[1] ?? "",
      browser: browserMatch?.[1] ?? "",
    };

    /* 3. Erreurs / Exceptions ------------------------- */
    const errors: LogError[] = [];
    const testcaseRegex =
      /<testcase\b([^>]*)>([\s\S]*?)<\/testcase>/gi; // g+i → multiple matches
    let m: RegExpExecArray | null;

    while ((m = testcaseRegex.exec(xml))) {
      const testcaseAttrs = m[1];
      const inner = m[2];

      const tcName =
        testcaseAttrs.match(/\bname="([^"]+)"/)?.[1] ?? "unknown_testcase";

      const failure =
        inner.match(
          /<failure\b[^>]*type="([^"]+)"[^>]*message="([^"]+)"[^>]*>([^]*?)<\/failure>/i
        ) ?? [];

      if (failure.length) {
        const [, type, message, stackRaw] = failure;
        const stack = stackRaw.trim();
        // Ligne approximative : position dans le fichier divisé par total lignes
        const lineNumber = Math.ceil(
          (testcaseRegex.lastIndex / xml.length) * lines.length
        );

        errors.push({
          type,
          message: `[${tcName}] ${message}`,
          stack,
          lineNumber,
          raw: inner,
        });
      }
    }

    /* 4. Infos diverses ------------------------------- */
    const versions: Record<string, string> = {};
    const versionProps = [...xml.matchAll(/<property[^>]*name="([\w-]*version)"[^>]*value="([^"]+)"/gi)];
    versionProps.forEach(([, name, val]) => (versions[name] = val));

    const testCases = [...xml.matchAll(/<testcase\b[^>]*name="([^"]+)"/gi)].map(
      (m) => m[1]
    );

    const misc: MiscInfo = {
      versions,
      apiEndpoints: [],
      testCases,
      folderIds: [],
    };

    return { summary, context: ctx, errors, misc };
  }
}
