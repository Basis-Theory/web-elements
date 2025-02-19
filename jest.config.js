const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  projects: [
    {
      automock: false,
      clearMocks: true,
      coveragePathIgnorePatterns: ['test', 'dist'],
      displayName: 'jsdom',
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}),
      modulePaths: ['<rootDir>'],
      roots: ['<rootDir>'],
      testEnvironment: 'jsdom',
      testPathIgnorePatterns: ['cypress'],
      transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
    },
  ],
};
