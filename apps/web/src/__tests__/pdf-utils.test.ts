import { describe, expect, it, vi } from 'vitest';
import { PDF_CONFIG, setHeading, setParagraph } from '../lib/pdf.js';

describe('pdf utilities', () => {
  it('apply heading and paragraph styles', () => {
    const doc = {
      setFontSize: vi.fn().mockReturnThis(),
      setFont: vi.fn().mockReturnThis(),
    };

    // Heading
    const returnedHeading = setHeading(doc);
    expect(doc.setFontSize).toHaveBeenCalledWith(PDF_CONFIG.headingSize);
    expect(doc.setFont).toHaveBeenCalledWith(PDF_CONFIG.fontFamily, 'bold');
    expect(returnedHeading).toBe(doc);

    doc.setFontSize.mockClear();
    doc.setFont.mockClear();

    // Paragraph
    const returnedParagraph = setParagraph(doc);
    expect(doc.setFontSize).toHaveBeenCalledWith(PDF_CONFIG.paragraphSize);
    expect(doc.setFont).toHaveBeenCalledWith(PDF_CONFIG.fontFamily, 'normal');
    expect(returnedParagraph).toBe(doc);
  });
});
