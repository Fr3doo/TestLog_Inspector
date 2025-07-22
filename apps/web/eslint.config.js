const baseConfig = require('../../eslint.config.cjs');
const nextPlugin = require('@next/eslint-plugin-next');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals']?.rules,
    },
  },
];
