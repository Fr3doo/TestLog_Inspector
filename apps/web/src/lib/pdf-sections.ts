import type { jsPDF } from 'jspdf';
import {
  addPage,
  addTable,
  addText,
  getPageWidth,
  splitText,
} from './pdf-tools.js';
import type { ParsedLog } from '@testlog-inspector/log-parser';
import { PDF_CONFIG, setHeading, setParagraph } from './pdf.js';

export interface SectionState {
  cursorY: number;
}

export type Section = (
  doc: jsPDF,
  data: ParsedLog,
  state: SectionState,
) => void;

function addHeading(doc: jsPDF, text: string, state: SectionState) {
  const { margin, lineHeight, headingSpacing } = PDF_CONFIG;
  setHeading(doc);
  addText(doc, text, margin, state.cursorY);
  state.cursorY += lineHeight + headingSpacing;
}

function addParagraph(doc: jsPDF, text: string, state: SectionState) {
  const { margin, lineHeight } = PDF_CONFIG;
  setParagraph(doc);
  // Law of Demeter: store deep property access in a helper
  const pageWidth = getPageWidth(doc);
  const splitted = splitText(doc, text, pageWidth - margin * 2);
  addText(doc, splitted, margin, state.cursorY);
  state.cursorY += splitted.length * lineHeight + lineHeight;
}

export const addSummary: Section = (doc, data, state) => {
  addHeading(doc, 'Résumé exécutif', state);
  addParagraph(doc, data.summary.text, state);
};

export const addContext: Section = (doc, data, state) => {
  addHeading(doc, 'Contexte', state);
  Object.entries(data.context)
    .filter(([, v]) => v)
    .forEach(([k, v]) => addParagraph(doc, `${k}: ${v}`, state));
};

export const addErrors: Section = (doc, data, state) => {
  addPage(doc);
  state.cursorY = PDF_CONFIG.margin;
  addHeading(doc, `Erreurs / Exceptions (${data.errors.length})`, state);
  addTable(doc, {
    startY: state.cursorY,
    head: [['Type', 'Message', 'Ligne']],
    body: data.errors.map((e) => [e.type, e.message, e.lineNumber.toString()]),
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [22, 119, 255] },
    margin: { left: PDF_CONFIG.margin, right: PDF_CONFIG.margin },
    didDrawPage: (hook) => {
      // Respect the Law of Demeter by storing nested access in a variable
      const cursorY = hook.cursor.y;
      state.cursorY = cursorY + PDF_CONFIG.lineHeight;
    },
  });
};

export const addMisc: Section = (doc, data, state) => {
  const parts: string[] = [];

  if (Object.keys(data.misc.versions).length) {
    parts.push(
      'Versions: ' +
        Object.entries(data.misc.versions)
          .map(([n, v]) => `${n} ${v}`)
          .join(', '),
    );
  }

  if (data.misc.apiEndpoints.length) {
    parts.push(`Endpoints API: ${data.misc.apiEndpoints.join(', ')}`);
  }

  if (data.misc.testCases.length) {
    parts.push(`Test cases: ${data.misc.testCases.join(', ')}`);
  }

  if (data.misc.folderIds.length) {
    parts.push(`Folder IDs: ${data.misc.folderIds.join(', ')}`);
  }

  if (parts.length) {
    state.cursorY += PDF_CONFIG.lineHeight;
    addHeading(doc, 'Informations diverses', state);
    parts.forEach((p) => addParagraph(doc, p, state));
  }
};

export const defaultSections: Section[] = [
  addSummary,
  addContext,
  addErrors,
  addMisc,
];
