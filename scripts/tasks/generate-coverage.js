'use strict';

/**
 * Wrapper module to invoke istanbul-combine synchronously so that it can be
 * integrated with grunt. This is used to convert the coverage.json output
 * produced by the phantom-hooks.js into an 'lcov' coverage format.
 *
 * Istanbul-combine combines one or more coverage.json objects to generate
 * a single coverage report.
 *
 * See https://github.com/jamestalmage/istanbul-combine for more details
 */
module.exports = function(grunt) {
  grunt.registerTask('generate-coverage', function() {
    var options = this.options();
    require('istanbul-combine').sync(options);
  });
};
