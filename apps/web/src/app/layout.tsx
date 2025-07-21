import '@/global.css'; // styles Tailwind + app-wide

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

/**
 * Root Layout (Next.js App Router)
 * --------------------------------
 * - Importe les styles globaux.
 * - Définit la police Inter comme font sans-serif par défaut.
 * - Ajoute l’attribut `class="dark"` si le thème sombre est stocké en localStorage.
 */
export const metadata: Metadata = {
  title: 'TestLog Inspector',
  description: 'Analysez vos logs de tests et générez des rapports clairs.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={inter.className}
      data-theme="light"
    >
      <body>
        {/* Theme toggle script (no flicker) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const stored = localStorage.getItem('theme');
                if (stored === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
