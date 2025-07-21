import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E config – lance un smoke-test front + back.
 *
 * 1. Démarre simultanément l’API NestJS (:3001) et le front Next.js (:3000)
 *    via la commande monorepo : "pnpm dev:all" (scripts section 8).
 * 2. Attend que http://localhost:3000 soit prêt avant d’exécuter les tests.
 * 3. Exécute un unique test Chromium (smoke) par défaut.  Développeurs
 *    peuvent étendre la suite en ajoutant d’autres fichiers *.pw.spec.ts
 *    sous tests/playwright/.
 */

export default defineConfig({
  testDir: 'tests/playwright',
  timeout: 60_000,
  expect: { timeout: 5_000 },

  /* Exécute uniquement Chromium sur CI pour rapidité */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Démarre la stack dev avant la suite */
  webServer: {
    command: 'pnpm dev:all',
    port: 3000,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI, // en local, ne redémarre pas si déjà en route
  },

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
  },
});
