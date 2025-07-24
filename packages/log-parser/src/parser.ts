/**
 * Public façade respectant SRP (1 seule responsabilité : orchestrer).
 * OCP : ajouter une stratégie via registerStrategy() sans modifier le code.
 */
import { IParsingStrategy, ParsedLog } from './types';
import { validateParsedLog } from './parsed-log.schema';
import { DefaultStrategy } from './strategies/default-strategy';
import { FileReader, IFileReader } from './file-reader';

/**
 * Read a file and return its content using UTF-8 encoding.
 *
 * @param path Absolute or relative file path
 * @throws Error when the file cannot be read
 */
export async function readFileContent(
  path: string,
  reader: IFileReader = new FileReader(),
): Promise<string> {
  return reader.read(path);
}

export class LogParser {
  private strategies: IParsingStrategy[] = [];

  constructor(
    strategies: IParsingStrategy[] = [],
    private readonly reader: IFileReader = new FileReader(),
  ) {
    // Always register default fallback
    this.registerStrategy(DefaultStrategy);
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
    if (!path) throw new Error('No file path provided');
    const content = await this.reader.read(path);

    const lines = content.split(/\r?\n/);
    const strategy =
      this.strategies.find((s) => s.canHandle(lines)) ??
      this.strategies[this.strategies.length - 1];

    const result = strategy.parse(lines);
    try {
      return validateParsedLog(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'invalid parsed log';
      throw new Error(`Invalid parsed log format: ${msg}`);
    }
  }
}
