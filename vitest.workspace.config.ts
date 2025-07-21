import { defineWorkspace } from 'vitest/config';
import { resolve } from 'node:path';

/**
 * Workspace Vitest
 * ----------------
 * • Agrège trois projets :
 *   1. apps/web (déjà doté de son propre vitest.config.ts)
 *   2. packages/log-parser  → tests Node (parser.spec.ts etc.)
 *   3. packages/ui-components → tests jsdom (React)
 *
 *   Les tests Jest (apps/api) NE sont PAS exécutés ici ; ils restent
 *   gérés par Jest pour profiter de l’intégration NestJS.
 */

export default defineWorkspace([
  // --- App Web --------------------------------------------------
  resolve(__dirname, 'apps/web/vitest.config.ts'),

  // --- Package log-parser --------------------------------------
  {
    name: 'log-parser',
    test: {
      environment: 'node',
      globals: true,
      include: ['packages/log-parser/**/*.spec.ts'],
      coverage: {
        reporter: ['text', 'lcov'],
      },
    },
    resolve: {
      alias: {
        '@parser': resolve(__dirname, 'packages/log-parser/src'),
      },
    },
  },

  // --- Package ui-components -----------------------------------
  {
    name: 'ui-components',
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: [resolve(__dirname, 'tests/react-rtl.d.ts')],
      include: ['packages/ui-components/**/*.spec.{ts,tsx}'],
      coverage: {
        reporter: ['text', 'lcov'],
      },
    },
    resolve: {
      alias: {
        '@ui': resolve(__dirname, 'packages/ui-components/src'),
      },
    },
  },
]);
