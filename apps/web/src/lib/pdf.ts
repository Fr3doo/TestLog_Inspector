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
export function setHeading<T extends FontUtils>(
  doc: T,
  config: typeof PDF_CONFIG = PDF_CONFIG,
): T {
  return doc.setFontSize(config.headingSize).setFont(config.fontFamily, 'bold');
}

/**
 * Apply paragraph style to the current jsPDF instance.
 */
export function setParagraph<T extends FontUtils>(
  doc: T,
  config: typeof PDF_CONFIG = PDF_CONFIG,
): T {
  return doc
    .setFontSize(config.paragraphSize)
    .setFont(config.fontFamily, 'normal');
}
