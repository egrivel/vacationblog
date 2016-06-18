'use strict';

var expect = require('chai').expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var About = require('../../src/components/About');

describe('components/About', function() {
  describe('#render', function() {
    var component = TestUtils.renderIntoDocument(
      React.createElement(About, null)
      );
    expect(component).to.be.ok;
  });
});
