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
          { tsconfig: '<rootDir>/tsconfig.json', useESM: true },
        ],
      },
      extensionsToTreatAsEsm: ['.ts'],
      moduleNameMapper: {
        '^@testlog-inspector/(.*)$': '<rootDir>/../../packages/$1/src',
        '^\\./middlewares/file-validation.middleware.js$':
          '<rootDir>/src/middlewares/file-validation.middleware.ts',
        '^\./config.js$': '<rootDir>/src/common/config.ts',
        '^\./config.service.js$': '<rootDir>/src/common/config.service.ts',
        '^\./file-validation.service.js$':
          '<rootDir>/src/services/file-validation.service.ts',
        '^\./file-validator.service.js$':
          '<rootDir>/src/services/file-validator.service.ts',
        '^\.\./(common|services|controllers|log-analysis)/(.+)\.js$':
          '<rootDir>/src/$1/$2.ts',
        '^\./(controllers)/(.+)\.js$': '<rootDir>/src/$1/$2.ts',
        '^\./services/(.+)\.js$': '<rootDir>/src/services/$1.ts',
        '^\./common/config.module.js$': '<rootDir>/src/common/config.module.ts',
        '^\.\./app.module.js$': '<rootDir>/src/app.module.ts',
      },
      preset: 'ts-jest',
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      coverageDirectory: '<rootDir>/../../coverage/api',
      collectCoverageFrom: ['<rootDir>/src/**/*.(t|j)s'],
    },
  ],
};
