'use strict';

/**
 * Hook to Phantom JS at the end of the client-side testing to generate the
 * coverage.json file
 */

/* global window */

module.exports = {
  afterEnd: function(runner) {
    var fs = require('fs');
    var coverage = runner.page.evaluate(function() {
      return window.__coverage__;
    });

    if (coverage) {
      console.log('Writing coverage data to ' +
        'coverage/raw-coverage.json');
      fs.write('coverage/raw-coverage.json',
        JSON.stringify(coverage), 'w');
    } else {
      console.log('No coverage data generated');
    }
  }
};
