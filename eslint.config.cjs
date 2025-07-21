const tsParser = require('@typescript-eslint/parser');
const js = require('@eslint/js');
const globals = require('globals');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const prettier = require('eslint-config-prettier');

module.exports = [
  // Désactive `no-undef` pour tous les TS/TSX (et CJS/MJS associés)
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parser: tsParser,
      // on garde tsconfigRootDir défini dans le bloc principal
    },
    rules: {
      'no-undef': 'off'
    }
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    ignores: ['node_modules/**', 'dist/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      import: require('eslint-plugin-import'),
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-this-alias': 'off',
    },
  },
  prettier,
];
