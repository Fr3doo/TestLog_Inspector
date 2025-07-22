export interface FontUtils {
  setFontSize(size: number): this;
  setFont(family: string, style?: string): this;
}

/** Shared configuration for PDF generation. */
export const PDF_CONFIG = {
  margin: 40,
  lineHeight: 14,
  headingSize: 14,
  paragraphSize: 11,
  headingSpacing: 4,
  fontFamily: 'helvetica',
} as const;

/**
 * Apply heading style to the current jsPDF instance.
 */
export function setHeading<T extends FontUtils>(doc: T): T {
  return doc
    .setFontSize(PDF_CONFIG.headingSize)
    .setFont(PDF_CONFIG.fontFamily, 'bold');
}

/**
 * Apply paragraph style to the current jsPDF instance.
 */
export function setParagraph<T extends FontUtils>(doc: T): T {
  return doc
    .setFontSize(PDF_CONFIG.paragraphSize)
    .setFont(PDF_CONFIG.fontFamily, 'normal');
}
