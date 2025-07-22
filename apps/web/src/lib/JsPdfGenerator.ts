import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ParsedLog } from '@testlog-inspector/log-parser';
import type { IPdfGenerator } from './IPdfGenerator';
import { PDF_CONFIG, setHeading, setParagraph } from './pdf';

/**
 * Implémentation concrète de `IPdfGenerator` basée sur jsPDF.
 * Gère la mise en page du rapport et déclenche le téléchargement.
 */
export class JsPdfGenerator implements IPdfGenerator {
  async generate(data: ParsedLog, filename = 'testlog-report.pdf'): Promise<void> {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const { margin, lineHeight, headingSpacing } = PDF_CONFIG;
    let cursorY = margin;

    const addHeading = (text: string) => {
      setHeading(doc);
      doc.text(text, margin, cursorY);
      cursorY += lineHeight + headingSpacing;
    };

    const addParagraph = (text: string) => {
      setParagraph(doc);
      const splitted = doc.splitTextToSize(
        text,
        doc.internal.pageSize.getWidth() - margin * 2,
      );
      doc.text(splitted, margin, cursorY);
      cursorY += splitted.length * lineHeight + lineHeight;
    };

    /* ---------- Page 1 : résumé + contexte ---------- */
    const sections = [
      {
        title: 'Résumé exécutif',
        paragraphs: [data.summary.text],
      },
      {
        title: 'Contexte',
        paragraphs: Object.entries(data.context)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: ${v}`),
      },
    ];

    sections.forEach(({ title, paragraphs }) => {
      addHeading(title);
      paragraphs.forEach(addParagraph);
    });

    doc.addPage();
    cursorY = margin;

    /* ---------- Erreurs / exceptions ---------------- */
    addHeading(`Erreurs / Exceptions (${data.errors.length})`);

    autoTable(doc, {
      startY: cursorY,
      head: [['Type', 'Message', 'Ligne']],
      body: data.errors.map((e) => [e.type, e.message, e.lineNumber.toString()]),
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [22, 119, 255] },
      margin: { left: margin, right: margin },
      didDrawPage: (hook) => {
        cursorY = hook.cursor.y + lineHeight;
      },
    });

    /* ---------- Infos diverses ---------------------- */
    const miscParts: string[] = [];

    if (Object.keys(data.misc.versions).length) {
      miscParts.push(
        'Versions: ' +
          Object.entries(data.misc.versions)
            .map(([n, v]) => `${n} ${v}`)
            .join(', '),
      );
    }

    if (data.misc.apiEndpoints.length) {
      miscParts.push(`Endpoints API: ${data.misc.apiEndpoints.join(', ')}`);
    }

    if (data.misc.testCases.length) {
      miscParts.push(`Test cases: ${data.misc.testCases.join(', ')}`);
    }

    if (data.misc.folderIds.length) {
      miscParts.push(`Folder IDs: ${data.misc.folderIds.join(', ')}`);
    }

    if (miscParts.length) {
      cursorY += lineHeight;
      addHeading('Informations diverses');
      miscParts.forEach(addParagraph);
    }

    /* ---------- Téléchargement ----------------------- */
    doc.save(filename);
  }
}
