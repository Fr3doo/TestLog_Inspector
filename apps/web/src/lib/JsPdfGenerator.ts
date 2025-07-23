import { jsPDF } from 'jspdf';
import type { ParsedLog } from '@testlog-inspector/log-parser';
import type { IPdfGenerator } from './IPdfGenerator';
import { PDF_CONFIG } from './pdf';
import { Section, SectionState, defaultSections } from './pdf-sections';

/**
 * Implémentation concrète de `IPdfGenerator` basée sur jsPDF.
 * Gère la mise en page du rapport et déclenche le téléchargement.
 */
export class JsPdfGenerator implements IPdfGenerator {
  constructor(private readonly sections: Section[] = defaultSections) {}

  async generate(
    data: ParsedLog,
    filename = 'testlog-report.pdf',
  ): Promise<void> {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const state: SectionState = { cursorY: PDF_CONFIG.margin };

    for (const section of this.sections) {
      section(doc, data, state);
    }

    doc.save(filename);
  }
}
