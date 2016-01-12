// Karma configuration
//
// Start out with coverage-mocha-istanbul-karma, example at
//   https://github.com/ariya/coverage-mocha-istanbul-karma/blob/master/Gruntfile.js
//
// need browserify to process the 'require' statements
//   https://github.com/nikku/karma-browserify
//
// phantomjs-shim:
//   npm install karma-phantomjs-shim
//   https://groups.google.com/forum/#!msg/phantomjs/r0hPOmnCUpc/uxusqsl2LNoJ
//   https://github.com/tschaub/karma-phantomjs-shim
//
// browserify-istanbul
//   http://stackoverflow.com/questions/31137351/karma-code-coverage-always-100
//
// karma-coverage-allsources
//   https://www.npmjs.com/package/karma-coverage-allsources

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['browserify', 'mocha', 'phantomjs-shim'],

    // list of files / patterns to load in the browser
    files: [
      'jstest/components/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    plugins: [
      'karma-browserify',
      'karma-coverage',
      'karma-coverage-allsources',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-phantomjs-shim'
    ],

    browsers: [
      'PhantomJS'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'jstest/components/*.js': ['browserify'],
      'src/components/*.js': ['coverage']
    },

    browserify: {
      debug: true,
      transform: ['browserify-istanbul']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage-allsources', 'coverage'],

    coverageReporter: {
      dir: 'coverage/',
      include: 'src/components/*.js',
      exclude: 'jstest/**/*.js',
      reporters: [
        { type: 'lcov', subdir: 'components' }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
