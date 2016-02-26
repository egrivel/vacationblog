'use strict';

var chalk = require('chalk');
var _ = require('lodash');

/**
* Custom Grunt Task
*
* Scans provided files against list of provided patterns that have been
* determined to represent a "bad" or "non-secure" coding practice.
* This is a simple version that will output to the console.
* If the --bad-pattern-no-fail flag is set then any matches
 * will not cause a build failure.
*
* On CI run as follows to fail build:
 *  grunt check-files
* Locally run as follows for warnings only:
 *  grunt check-files --bad-pattern-no-fail
*
* Note: grunt built-in feature. Try running with --verbose to see files
*
* Example configuration:
 * check-files: {
*   src: 'src/*',
*   badPatterns: [{
*     pattern: /someRegex/,
 *     resolution: 'How to fix'
*   }]
* }
*/

// Internal config reference
var _badPatterns = [];

// Recursive file scanning function
var scanner = function(grunt, source, messages) {
  grunt.file.expand(source).forEach(function(file) {
    if (grunt.file.isDir(file)) {
      grunt.file.recurse(file, function(f) {
        messages = scanner(grunt, f, messages);
      });

    } else {
      var fileAsString = grunt.file.read(file);
      _badPatterns.forEach(function(itm) {
        var idx = fileAsString.search(itm.pattern);
        if (idx >= 0) {
          var subStr = fileAsString.slice(idx, idx + 30);
          messages.push({
            issue: 'File "' + file + '" failed pattern "' + itm.pattern +
              '" due to text starting at:\n  ' + chalk.cyan(subStr) + '...',
            resolution: itm.resolution || 'None provided'
          });
        }
      });
    }
  });
  return messages;
};

module.exports = function(grunt) {

  var div = '----------------------------------------------------------------';
  grunt.registerTask('check-files', function() {

    // If bad-pattern-no-fail is truthy warn and do not fail build
    var warnOnlyMode = grunt.option('bad-pattern-no-fail');

    // Validation: Patterns must be regex
    var badPatterns = grunt.config.get('check-files.badPatterns');
    badPatterns.forEach(function(itm) {
      if (!_.isRegExp(itm.pattern)) {
        grunt.fail.fatal(new Error(
          'Pattern must be of type RegExp: ' +
          itm.pattern)
        );
      }
    });
    _badPatterns = badPatterns;

    // Get file glob and start scan
    var files = grunt.config.get('check-files.src');
    var messages = scanner(grunt, files, []);

    // Process output
    grunt.log.writeln(chalk.yellow(div));
    grunt.log.writeln('File Scan Results');
    if (warnOnlyMode) {
      grunt.log.writeln(
        chalk.yellow('WARN ONLY MODE: Matches will not fail the build'));
      grunt.log.writeln(chalk.yellow(
        'Remove bad-pattern-no-fail flag or set to false to fail build'));
    }
    if (messages && messages.length) {

      messages.forEach(function(m) {
        grunt.log.writeln(chalk.red('\nIssue:'), m.issue);
        grunt.log.writeln(chalk.blue('Resolution:'), m.resolution);
        grunt.log.writeln('');
      });

      grunt.log.writeln(chalk.red(messages.length + ' matches found.'));

      if (!warnOnlyMode) {
        grunt.fail.warn('Scan failed due to DCPS custom file scan rules', 3);
      }

    } else {
      grunt.log.writeln(chalk.yellow('No problems found.'));
    }
    grunt.log.writeln(chalk.yellow(div));

  });
};
