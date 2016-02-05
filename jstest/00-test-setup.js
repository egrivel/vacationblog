/**
 * Loading the environment needed to run React tests. This file must be
 * run before any of the test files that use React functionality. Note
 * that this is achieve by giving the file a filename that comes before
 * any of the other test files or directories!
 */

var jsdom = require('mocha-jsdom');
jsdom();
