/**
 * Setup global Vitest (jsdom) pour l’app Web.
 * -------------------------------------------
 * - Ajoute les matchers jest-dom (toBeInTheDocument, …).
 * - Polyfill léger de window.matchMedia (Next.js en dépend).
 * - Fixe TZ Europe/Paris pour des snapshots cohérents.
 */

import '@testing-library/jest-dom';

// TZ fix (cohérent avec backend)
process.env.TZ = 'Europe/Paris';

// Polyfill matchMedia → évite "matchMedia not implemented"
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {}, // deprecated
      removeListener: () => {}, // deprecated
      dispatchEvent: () => false,
    } as unknown as MediaQueryList);
}
