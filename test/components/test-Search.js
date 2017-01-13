'use strict';

const expect = require('chai').expect;
const React = require('react');
const TestUtils = require('react-addons-test-utils');

const Search = require('../../src/components/Search.jsx');

describe('components/Search', function() {
  describe('#render', function() {
    const component = TestUtils.renderIntoDocument(
      React.createElement(Search, null)
      );
    expect(component).to.be.ok;
  });
});
