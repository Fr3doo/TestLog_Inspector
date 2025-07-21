/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Permet à Next.js de transpiler nos packages workspaces (TS pur)
  experimental: {
    transpilePackages: [
      '@testlog-inspector/ui-components',
      '@testlog-inspector/log-parser',
    ],
  },

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

  // Configuration Tailwind / PostCSS déjà prise en charge via plugins
};

export default nextConfig;
