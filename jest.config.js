module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],

  // Optional: To generate HTML test reports, uncomment the reporters section below
  // and install: npm install --save-dev jest-html-reporter
  // reporters: [
  //   'default',
  //   ['jest-html-reporter', {
  //     pageTitle: 'Test Results',
  //     outputPath: 'test-results/test-report.html',
  //     includeFailureMsg: true,
  //     includeConsoleLog: true,
  //   }],
  // ],
};
