/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  // Fichiers dans lesquels Tailwind doit rechercher des classes
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui-components/src/**/*.{ts,tsx}',
    '../../node_modules/@shadcn/ui/dist/**/*.{ts,tsx}', // composants shadcn
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },

  plugins: [
    require('tailwindcss-animate'),   // animations utilitaires
    require('@tailwindcss/typography'),
  ],
};
