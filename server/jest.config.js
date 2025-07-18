module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  // A path to a module which sets up the global testing environment
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};