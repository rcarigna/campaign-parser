// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require('next/jest');

// Create Jest configuration with Next.js
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Test environment setup
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/src/setupTests.ts',
    '<rootDir>/jest.setup.js',
  ],

  // Module name mapping for path aliases and CSS/asset mocking
  moduleNameMapper: {
    // Path aliases (matching tsconfig.json)
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/services/(.*)$': '<rootDir>/src/lib/services/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',

    // CSS and asset mocking
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/app/layout.tsx', // Exclude Next.js boilerplate
    '!src/app/page.tsx', // Exclude main page unless it has logic
    // Exclude server-side services that need integration tests
    '!src/lib/services/documentParser/**',
    '!src/lib/services/entityExtractor/**',
    // Exclude components that need integration testing
    '!src/components/Entity/EntityMergeModal/**',
  ],

  // Coverage thresholds (adjusted for current codebase)
  coverageThreshold: {
    global: {
      branches: 65, // Slightly lower for branch coverage
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

  // Coverage reporting
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],

  // Test file patterns
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.(test|spec).{ts,tsx}',
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/build/',
  ],

  // Transform ignore patterns for ES modules (let Next.js handle marked)
  transformIgnorePatterns: ['node_modules/(?!(marked)/)'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output for debugging
  verbose: false,
};

// Export Jest configuration created by Next.js
module.exports = createJestConfig(customJestConfig);
