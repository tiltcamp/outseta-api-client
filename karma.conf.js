// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine', 'karma-typescript'],
    plugins: [
      'karma-typescript',
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-jasmine-html-reporter'
    ],
    karmaTypescriptConfig: {
      tsconfig: "./tsconfig.spec.json",
      coverageOptions: {
        threshold: {
          file: {
            statements: 100,
            lines: 100,
            branches: 100,
            functions: 100
          }
        }
      },
      reports: {
        html: {
          directory: 'coverage',
          subdirectory: 'outseta-api-client',
          filename: 'index.html'
        },
        lcovonly:  {
          directory: 'coverage',
          subdirectory: 'outseta-api-client',
          filename: 'lcov.info'
        },
        'text-summary': null
      },
    },
    files: [
      { pattern: 'src/**/*.ts' },
      { pattern: 'test/**/*.spec.ts' }
    ],
    preprocessors: {
      'src/**/*.ts': [ 'karma-typescript' ],
      'test/**/*.spec.ts': [ 'karma-typescript' ]
    },
    reporters: ['progress', 'kjhtml', 'karma-typescript'],
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['Chrome']
  });
};
