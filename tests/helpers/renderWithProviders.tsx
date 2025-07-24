import { render, RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { JsPdfGenerator } from '../../apps/web/src/lib/JsPdfGenerator.js';
import { PdfGeneratorProvider } from '../../apps/web/src/lib/PdfGeneratorContext.js';

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const generator = new JsPdfGenerator();
  return render(
    <PdfGeneratorProvider value={generator}>{ui}</PdfGeneratorProvider>,
    options,
  );
}

export * from '@testing-library/react';
