module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testMatch: ['**/**/*.test.ts'],
  clearMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/../shared/$1'
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts', '!src/index.ts', '!src/server.ts', '!src/tests/**']
};
