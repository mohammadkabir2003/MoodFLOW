const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  collectCoverage: true,
  collectCoverageFrom: [
  "src/**/*.{js,jsx,ts,tsx}",
  "!src/**/*.test.{js,jsx,ts,tsx}",
  "!src/**/__tests__/**",
  "!src/app/layout.tsx",
  "!src/lib/**"
]
};

module.exports = createJestConfig(customJestConfig);