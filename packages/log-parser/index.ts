/**
 * Public API of @testlog-inspector/log-parser
 * ------------------------------------------------
 * - LogParser         : orchestrator (Strategy)
 * - ParsedLog & co.   : strongly‑typed results
 * - DefaultStrategy   : fallback parsing strategy
 *
 * Pour ajouter votre propre stratégie :
 *   import { LogParser, BaseStrategy } from '@testlog-inspector/log-parser';
 *   class MyStrategy extends BaseStrategy { … }
 *   const parser = new LogParser();
 *   parser.registerStrategy(new MyStrategy());
 */

export * from "./src/parser.js";
export { readFileContent } from "./src/parser.js";
export * from "./src/types.js";
export * from "./src/ILogParser.js";

export { DefaultStrategy } from "./src/strategies/default-strategy.js";
export { BaseStrategy } from "./src/strategies/base-strategy.js";
export { JsonStrategy } from "./src/strategies/json-strategy.js";
export { JunitStrategy } from "./src/strategies/junit-strategy.js";
export { XmlStrategy } from "./src/strategies/xml-strategy.js";
