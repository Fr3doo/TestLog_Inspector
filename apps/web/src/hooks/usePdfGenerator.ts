'use client';

import { useCallback } from 'react';
import type { ParsedLog } from '@testlog-inspector/log-parser';
import { usePdfGeneratorContext } from '@/lib/PdfGeneratorContext';

/**
 * Hook renvoyant la fonction de génération de PDF.
 * Permet de remplacer l'implémentation via `PdfGeneratorProvider`.
 */
export function usePdfGenerator() {
  const generator = usePdfGeneratorContext();
  return useCallback(
    (data: ParsedLog, filename?: string) => generator.generate(data, filename),
    [generator],
  );
}
