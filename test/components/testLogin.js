'use strict';

var expect = require('chai').expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var Login = require('../../src/components/Login');

describe('Login component', function() {
  describe('#render', function() {
    var component = TestUtils.renderIntoDocument(
      React.createElement(Login, null)
      );
    expect(component).to.be.ok;
  });
});
