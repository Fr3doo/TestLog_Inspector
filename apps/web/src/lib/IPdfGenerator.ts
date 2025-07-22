import type { ParsedLog } from '@testlog-inspector/log-parser';

/**
 * Abstraction de service de génération de PDF.
 * Permet d'injecter différentes implémentations
 * (par ex. un mock en tests ou jsPDF en production).
 */
export interface IPdfGenerator {
  /**
   * Génère un rapport PDF à partir des données analysées.
   * @param data      Données issues du parsing.
   * @param filename  Nom du fichier à télécharger (optionnel).
   */
  generate(data: ParsedLog, filename?: string): Promise<void>;
}
