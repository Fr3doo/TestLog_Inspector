import { ParsedLog } from '@testlog-inspector/log-parser/src/types';

/**
 * DTO de sortie pour l’analyse d’un log.
 * Actuellement identique à ParsedLog, mais séparé
 * pour permettre une évolution indépendante de la
 * structure interne de la librairie.
 */
export type AnalyzedResultDto = ParsedLog;
