import { describe, expect, it, vi } from 'vitest';
import { setHeading, setParagraph } from '../lib/pdf';

describe('pdf utilities', () => {
  it('apply heading and paragraph styles', () => {
    const doc = {
      setFontSize: vi.fn().mockReturnThis(),
      setFont: vi.fn().mockReturnThis(),
    };

    // Heading
    const returnedHeading = setHeading(doc);
    expect(doc.setFontSize).toHaveBeenCalledWith(14);
    expect(doc.setFont).toHaveBeenCalledWith('helvetica', 'bold');
    expect(returnedHeading).toBe(doc);

    doc.setFontSize.mockClear();
    doc.setFont.mockClear();

    // Paragraph
    const returnedParagraph = setParagraph(doc);
    expect(doc.setFontSize).toHaveBeenCalledWith(11);
    expect(doc.setFont).toHaveBeenCalledWith('helvetica', 'normal');
    expect(returnedParagraph).toBe(doc);
  });
});
