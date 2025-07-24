import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PdfGeneratorProvider } from '@/lib/PdfGeneratorContext';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog.js';

describe('usePdfGenerator', () => {
  it('uses the injected generator', async () => {
    const generate = vi.fn().mockResolvedValue(undefined);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <PdfGeneratorProvider value={{ generate }}>
        {children}
      </PdfGeneratorProvider>
    );
    const { result } = renderHook(() => usePdfGenerator(), { wrapper });
    await act(async () => {
      await result.current(parsedLogFixture);
    });
    expect(generate).toHaveBeenCalledWith(parsedLogFixture, undefined);
  });
});
