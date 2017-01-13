'use strict';

const expect = require('chai').expect;
const React = require('react');
const TestUtils = require('react-addons-test-utils');

const About = require('../../src/components/About.jsx');

describe('components/About', function() {
  describe('#render', function() {
    const component = TestUtils.renderIntoDocument(
      React.createElement(About, null)
      );
    expect(component).to.be.ok;
  });
});
