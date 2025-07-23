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
