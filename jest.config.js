// Root Jest configuration for VS Code extension compatibility
// This points Jest to the Next.js application where the actual testing happens

module.exports = {
  projects: [
    {
      displayName: 'Next.js App',
      rootDir: '<rootDir>/obsidian-parser-nextjs',
      ...require('./obsidian-parser-nextjs/jest.config.js'),
    },
  ],

  // Global settings
  verbose: false,

  // This ensures the root directory tests are ignored
  // All testing happens in the Next.js app
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/obsidian-parser-vite-express/', // Ignore old monorepo
  ],
};
