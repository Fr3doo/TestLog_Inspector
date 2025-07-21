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

export * from "./src/parser";
export * from "./src/types";

export { DefaultStrategy } from "./src/strategies/default-strategy";
export { BaseStrategy } from "./src/strategies/base-strategy";
