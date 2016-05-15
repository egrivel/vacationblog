'use strict';

var _ = require('lodash');

var expect = require('chai').expect;
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var Login = require('../../src/components/Login.jsx');

describe('Login component', function() {
  describe('#render', function() {
    var component = TestUtils.renderIntoDocument(
      React.createElement(Login, {onClose: _.noop})
      );
    expect(component).to.be.ok;
  });
});
