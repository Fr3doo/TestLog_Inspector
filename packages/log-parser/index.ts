/**
 * Public API of @testlog-inspector/log-parser
 * ------------------------------------------------
 * - LogParser         : orchestrator (Strategy)
 * - ParsedLog & co.   : strongly‑typed results
 * - DefaultStrategy   : fallback parsing strategy
 *
 * Pour ajouter votre propre stratégie :
 *   import { LogParser } from '@testlog-inspector/log-parser';
 *   import type { IParsingStrategy } from '@testlog-inspector/log-parser';
 *   class MyStrategy implements IParsingStrategy { … }
 *   const parser = new LogParser();
 *   parser.registerStrategy(new MyStrategy());
 */

export * from './src/parser.js';
export { readFileContent } from './src/parser.js';
export { FileReader } from './src/file-reader.js';
export type { IFileReader } from './src/file-reader.js';
export { readFile, writeFile } from './src/file-utils.js';
export * from './src/types.js';
export * from './src/ILogParser.js';

export { DefaultStrategy } from './src/strategies/default-strategy.js';
export { JsonStrategy } from './src/strategies/json-strategy.js';
export { JunitStrategy } from './src/strategies/junit-strategy.js';
export { XmlStrategy } from './src/strategies/xml-strategy.js';
export { parsedLogSchema, validateParsedLog } from './src/parsed-log.schema.js';
