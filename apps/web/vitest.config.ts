import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

/**
 * Vitest configuration pour l’app Next.js (Web).
 *
 * • Utilise le plugin React SWC (rapide, même pipeline que Next 14).
 * • Environnement JSDOM + globals = API Jest‐like.
 * • setupFiles => vitest.setup.ts (importe jest‑dom, mocks éventuels).
 * • Aliases cohérents avec tsconfig.json pour « @/… », « @ui », « @parser ».
 */

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@ui': resolve(__dirname, '../../packages/ui-components/src'),
      '@parser': resolve(__dirname, '../../packages/log-parser/src'),
      '@testlog-inspector/ui-components': resolve(
        __dirname,
        '../../packages/ui-components/src',
      ),
    },
  },
});
