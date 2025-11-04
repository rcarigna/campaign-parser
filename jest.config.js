// Root Jest configuration for VS Code extension compatibility
// This provides a simplified Jest config that doesn't rely on Next.js Jest integration
// to avoid "pages/app directory not found" errors when running from workspace root

module.exports = {
  displayName: 'Obsidian Parser Workspace',

  // Use projects to properly scope to Next.js directory
  projects: [
    {
      displayName: 'Next.js App Tests',
      rootDir: '<rootDir>/obsidian-parser-nextjs',
      testEnvironment: 'jsdom',

      // Basic test patterns
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/src/**/*.(test|spec).{ts,tsx}',
      ],

      // Setup files
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

      // Module name mapping for path aliases
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/services/(.*)$': '<rootDir>/src/lib/services/$1',
        '^@/types/(.*)$': '<rootDir>/src/types/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
      },

      // Transform configuration
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: '<rootDir>/tsconfig.json',
          },
        ],
      },

      // Module file extensions
      moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

      // Ignore patterns
      testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],

      // Transform ignore for ES modules
      transformIgnorePatterns: [
        '/node_modules/(?!(compromise|gray-matter|marked)/)',
      ],
    },
  ],

  // Global ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/obsidian-parser-vite-express/',
  ],

  verbose: false,
};
