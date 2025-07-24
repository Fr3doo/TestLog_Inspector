import { describe, it, expect, vi } from 'vitest';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog.js';

const fakeDoc = {
  setFontSize: vi.fn().mockReturnThis(),
  setFont: vi.fn().mockReturnThis(),
  text: vi.fn().mockReturnThis(),
  addPage: vi.fn().mockReturnThis(),
  splitTextToSize: vi.fn(() => ['']),
  internal: { pageSize: { getWidth: () => 800 } },
} as any;
const saveDocMock = vi.fn();
const createDocMock = vi.fn(() => fakeDoc);
const addPageMock = vi.fn();
const addTextMock = vi.fn();
const getPageWidthMock = vi.fn(() => 800);
const splitTextMock = vi.fn(() => ['']);
const addTableMock = vi.fn((_, opts) => {
  opts?.didDrawPage?.({ cursor: { y: 0 } } as any);
});

vi.mock('../lib/pdf-tools', () => ({
  createDoc: createDocMock,
  saveDoc: saveDocMock,
  addPage: addPageMock,
  addText: addTextMock,
  getPageWidth: getPageWidthMock,
  splitText: splitTextMock,
  addTable: addTableMock,
}));

describe('JsPdfGenerator.generate with many errors', () => {
  it('does not throw and saves the file', async () => {
    const { JsPdfGenerator } = await import('../lib/JsPdfGenerator');

    const errors = Array.from({ length: 200 }, (_, i) => ({
      type: 'ERROR',
      message: `error ${i}`,
      lineNumber: i,
      raw: `error ${i}`,
    }));
    const data = { ...parsedLogFixture, errors };

    const generator = new JsPdfGenerator();
    const filename = 'huge.pdf';
    await expect(generator.generate(data, filename)).resolves.not.toThrow();

    expect(saveDocMock).toHaveBeenCalledWith(fakeDoc, filename);
  });
});
