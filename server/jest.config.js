export const testEnvironment = 'node';
export const transform = {
  '^.+\\.ts$': 'ts-jest',
};
export const testRegex = '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$';
export const moduleFileExtensions = ['ts', 'js', 'json', 'node'];
export const collectCoverageFrom = [
  'src/**/*.ts',
  '!src/**/*.d.ts',
  '!src/**/*.test.ts',
  '!src/**/*.spec.ts',
];
export const coverageDirectory = 'coverage';
export const coverageReporters = ['text', 'lcov', 'html'];
export const coverageThreshold = {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
};
