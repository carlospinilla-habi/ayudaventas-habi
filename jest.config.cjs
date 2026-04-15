/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.ts'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/'],
  collectCoverageFrom: [
    'src/services/leads/**/*.{ts,tsx}',
    '!src/services/leads/index.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.integration.test.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 82,
      functions: 100,
      lines: 98,
      statements: 98,
    },
  },
}
