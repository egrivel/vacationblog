'use strict';

var path = require('path');

var setupBrowserify = function(grunt) {
  grunt.loadNpmTasks('grunt-browserify');
  grunt.config('browserify', {
    development: {
      src: ['src/boot.js'],
      dest: 'site/js/boot.js',
      options: {
        transform: [
          ['reactify']
        ]
      }
    },
    test: {
      src: [
        'jstest/00-test-setup.js',
        'jstest/**/*.js',
        '!jstest/components/testTripDescription.js',

        '!jstest/stores/testCommentStore.js',
        '!jstest/stores/testMenuStore.js',
        '!jstest/stores/testTripStore.js',
        '!jstest/stores/testUserStore.js'
      ],
      dest: 'temp/test.js',
      options: {
        transform: [
          ['reactify']
        ]
      }
    }
  });
};

var setupCoverage = function(grunt) {
  grunt.config('generate-coverage', {
    options: {
      dir: 'coverage',
      pattern: ['coverage/raw-coverage.json'],
      print: 'summary',
      reporters: {
        lcov: {}
      }
    }
  });

  grunt.registerTask('coverage', function() {
    grunt.option('run-coverage', true);
    grunt.task.run(['test', 'generate-coverage']);
  });
};

var setupMochaPhantomJs = function(grunt) {
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.config('mocha_phantomjs', {
    all: ['jstest/test.html'],
    options: {
      config: {
        grep: grunt.option('grep')
      }
    }
  });
};

var setupTest = function(grunt) {
  grunt.registerTask('test', function() {
    if (grunt.option('run-coverage')) {
      // instrument code for code coverage and write coverage.json after done
      grunt.config('browserify.test.options.transform',
        ['reactify', 'browserify-istanbul']);
      grunt.config('mocha_phantomjs.options.config.hooks',
          path.join(__dirname, 'scripts', 'tasks', 'phantom-hooks.js'));
    }

    grunt.task.run(['browserify:test', 'mocha_phantomjs']);
  });
};

var setupBuild = function(grunt) {
  grunt.registerTask('build', function() {
    grunt.task.run(['browserify:development']);
  });
};

var setupEslint = function(grunt) {
  grunt.loadNpmTasks('grunt-eslint');
  grunt.config('eslint', {
    src: ['src/**/*.jsx', 'src/**/*.js', 'jstest/**/*.js']
  });
};

var setupCheckFiles = function(grunt) {
  grunt.config('check-files', {
    src: 'src/*',
    //   (?:)  non-capturing grouping
    //   \w*   any whitespace character 0 or more times
    //   \(    matches left parens
    //   '|"   matches single quote OR double quote
    badPatterns: [{
      pattern: /eval(?:\s*)\(/,
      resolution: 'Do not use the eval statement, ' +
        'find another way to code this.'
    }, {
      pattern: /setTimeout(?:\s*)\((?:\s*)(?:'|")/,
      resolution: 'Use a function instead of a string'
    }, {
      pattern: /setInterval(?:\s*)\((?:\s*)(?:'|")/,
      resolution: 'Use a function instead of a string'
    }, {
      pattern: /Function(?:\s*)\((?:\s*)(?:'|")/,
      resolution: 'Use a function instead of a string'
    }, {
      pattern: /innerHTML/,
      resolution: 'Use textContent instead'
    }, {
      pattern: /dangerouslySetInnerHTML/,
      resolution: 'React coding issue: find another way to code this'
    }, {
      pattern: /\.(?:\s*)html(?:\s*)\(/,
      resolution: 'jQuery coding issue: use .text() instead'
    }, {
      pattern: /<%-/,
      resolution: 'EJS Template issue: use escaped form to output, ' +
        'e.g. %= instead of %-'
    }, {
      pattern: /\.(?:\s*)exec(?:\s*)\(/,
      resolution: 'This is looking for Node\'s child_process.exec() method' +
        'but will match any exec method. It is more secure to use ' +
        'child_process.execFile instead. If this is a custom method ' +
        'please change name'
    }]
  });
};

var setupAll = function(grunt) {
  grunt.registerTask('all',
    ['coverage', 'eslint', 'check-files']);
};

module.exports = function(grunt) {
  grunt.loadTasks('scripts/tasks');

  setupBrowserify(grunt);
  setupMochaPhantomJs(grunt);
  setupTest(grunt);
  setupCoverage(grunt);
  setupBuild(grunt);
  setupEslint(grunt);
  setupCheckFiles(grunt);
  setupAll(grunt);
};
