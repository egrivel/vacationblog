'use strict';

const _ = require('lodash');

const expect = require('chai').expect;
const React = require('react');
const TestUtils = require('react-addons-test-utils');

const Login = require('../../src/components/Login.jsx');

describe('components/Login', function() {
  describe('#render', function() {
    const component = TestUtils.renderIntoDocument(
      React.createElement(Login, {onClose: _.noop})
      );
    expect(component).to.be.ok;
  });
});
