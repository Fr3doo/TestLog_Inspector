/**
 * commitlint – Conventionnal Commits
 * ----------------------------------
 * Garantit des messages de commit cohérents :
 *   <type>(<scope>): <subject>
 *
 * Types autorisés : feat, fix, docs, style, refactor, test, chore, ci
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'ci',
      ],
    ],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'never', ['sentence-case', 'start-case']],
  },
};
/**
 * lint-staged – Pré-commit Hooks
 * ------------------------------
 * Exécute des actions rapides avant chaque commit :
 *   • Formatage Prettier
 *   • ESLint avec --fix
 *   • Lancement des tests (Vitest) uniquement sur les fichiers modifiés
 *     pour un feedback immédiat sans bloquer (fail-fast).
 */
module.exports = {
  // Tous les fichiers texte -> Prettier
  '*.{ts,tsx,js,json,md,yml,yaml,cjs,mjs,css}': ['prettier --write'],

  // Fichiers sources TypeScript / JavaScript -> ESLint --fix
  '*.{ts,tsx,js,cjs,mjs}': ['eslint --fix'],

  // Tests unitaires Vitest uniquement sur packages & web
  // (Jest API tourne via CI, pas nécessaire ici)
  'apps/web/**/*.{ts,tsx}': ['vitest run --changed'],
  'packages/**/*.{ts,tsx}': ['vitest run --changed'],
};
