import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function createDoc() {
  return new jsPDF({ unit: 'pt', format: 'a4' });
}

export function saveDoc(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function addPage(doc: jsPDF) {
  doc.addPage();
}

export function addText(
  doc: jsPDF,
  text: string | string[],
  x: number,
  y: number,
) {
  doc.text(text, x, y);
}

export function splitText(doc: jsPDF, text: string, width: number) {
  return doc.splitTextToSize(text, width);
}

export function getPageWidth(doc: jsPDF) {
  return doc.internal.pageSize.getWidth();
}

export function addTable(doc: jsPDF, options: Parameters<typeof autoTable>[1]) {
  autoTable(doc, options);
}
