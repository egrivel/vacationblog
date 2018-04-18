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
        'test/00-test-setup.js',
        'test/**/*.js'
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
    all: ['test/test.html'],
    options: {
      config: {
        grep: grunt.option('grep')
      },
      phantomConfig: {
        '--load-images': false
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
    src: ['src/**/*.jsx', 'src/**/*.js', 'test/**/*.js']
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
    }, {
      pattern: /console\.log/,
      resolution: 'Remove console logging'
    }]
  });
};

var setupAll = function(grunt) {
  grunt.registerTask('all',
    ['coverage', 'eslint', 'check-files']);
};

var setupExec = function(grunt) {
  grunt.loadNpmTasks('grunt-exec');
  grunt.config('exec', {
    deploy: {
      command: 'scripts/deploy.sh'
    },
    localPublish: {
      command: 'scripts/local-publish.sh'
    }
  });
  grunt.registerTask('deploy', ['browserify:development', 'exec:deploy']);
  grunt.registerTask('localPublish', ['browserify:development', 'exec:localPublish']);
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
  setupExec(grunt);
};
