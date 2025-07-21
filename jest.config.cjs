/**
 * Racine Jest – ne lance que les tests NestJS (apps/api).
 * ------------------------------------------------------
 * Les autres packages / front utilisent **Vitest**.
 */

module.exports = {
  projects: [
    {
      displayName: 'api',
      rootDir: 'apps/api',
      testMatch: ['<rootDir>/**/*.spec.ts'],
      moduleFileExtensions: ['ts', 'js', 'json'],
      transform: {
        '^.+\\.ts$': [
          'ts-jest',
          { tsconfig: '<rootDir>/tsconfig.json', useESM: true }
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      preset: 'ts-jest',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      coverageDirectory: '<rootDir>/../../coverage/api',
      collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
    },
  ],
};
