/**
 * Public façade respectant SRP (1 seule responsabilité : orchestrer).
 * OCP : ajouter une stratégie via registerStrategy() sans modifier le code.
 */
import fs from "node:fs/promises";
import { IParsingStrategy, ParsedLog } from "./types";
import { DefaultStrategy } from "./strategies/default-strategy";

/**
 * Read a file and return its content using UTF-8 encoding.
 *
 * @param path Absolute or relative file path
 * @throws Error when the file cannot be read
 */
export async function readFileContent(path: string): Promise<string> {
  return fs.readFile(path, "utf-8").catch((e) => {
    throw new Error(`Unable to read file "${path}" — ${(e as Error).message}`);
  });
}

export class LogParser {
  private strategies: IParsingStrategy[] = [];

  constructor(strategies: IParsingStrategy[] = []) {
    // Always register default fallback
    this.registerStrategy(new DefaultStrategy());
    // Register provided strategies (highest priority first)
    for (const s of [...strategies].reverse()) {
      this.registerStrategy(s);
    }
  }

  registerStrategy(strategy: IParsingStrategy) {
    this.strategies.unshift(strategy);
  }

  /**
   * Lit le fichier une seule fois et renvoie un ParsedLog.
   * @throws Error si le fichier est inaccessible ou corrompu.
   */
  async parseFile(path: string): Promise<ParsedLog> {
    if (!path) throw new Error("No file path provided");
    const content = await readFileContent(path);

    const lines = content.split(/\r?\n/);
    const strategy =
      this.strategies.find((s) => s.canHandle(lines)) ??
      this.strategies[this.strategies.length - 1];

    return strategy.parse(lines);
  }
}
