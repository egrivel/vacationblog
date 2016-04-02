'use strict';

var expect = require('chai').expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var Search = require('../../src/components/Search');

describe('Serach component', function() {
  describe('#render', function() {
    var component = TestUtils.renderIntoDocument(
      React.createElement(Search, null)
      );
    expect(component).to.be.ok;
  });
});
