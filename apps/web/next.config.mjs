import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Permet à Next.js de transpiler nos packages workspaces (TS pur)
  transpilePackages: [
    '@testlog-inspector/ui-components',
    '@testlog-inspector/log-parser',
  ],

  // Standalone ⇒ déploiement plus simple (Docker, PM2…)
  output: 'standalone',

  // Variables d’environnement exposées au front
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  },

  eslint: {
    // Ne bloque pas la prod build — Turbo gère déjà le lint en CI
    ignoreDuringBuilds: true,
  },

  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@ui': path.resolve(__dirname, '../../packages/ui-components/src'),
      '@parser': path.resolve(__dirname, '../../packages/log-parser/src'),
    };
    return config;
  },

  // Configuration Tailwind / PostCSS déjà prise en charge via plugins
};

export default nextConfig;
