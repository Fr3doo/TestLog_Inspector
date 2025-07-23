'use client';
import { createContext, useContext } from 'react';
import type { IPdfGenerator } from './IPdfGenerator';
import { JsPdfGenerator } from './JsPdfGenerator';

/**
 * Contexte React fournissant un `IPdfGenerator`.
 * Le provider permet de remplacer l'implémentation en tests.
 */
export const PdfGeneratorContext = createContext<IPdfGenerator>(new JsPdfGenerator());

export const PdfGeneratorProvider = PdfGeneratorContext.Provider;

export function usePdfGeneratorContext() {
  return useContext(PdfGeneratorContext);
}
