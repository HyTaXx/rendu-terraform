module.exports = {
  testEnvironment: 'node',
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: ['**/tests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
