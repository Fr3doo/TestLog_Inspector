export interface FontUtils {
  setFontSize(size: number): this;
  setFont(family: string, style?: string): this;
}

/**
 * Apply heading style to the current jsPDF instance.
 */
export function setHeading<T extends FontUtils>(doc: T): T {
  return doc.setFontSize(14).setFont('helvetica', 'bold');
}

/**
 * Apply paragraph style to the current jsPDF instance.
 */
export function setParagraph<T extends FontUtils>(doc: T): T {
  return doc.setFontSize(11).setFont('helvetica', 'normal');
}
