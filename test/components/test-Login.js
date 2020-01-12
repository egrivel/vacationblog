'use strict';

import _ from 'lodash';

const expect = require('chai').expect;
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Login from '../../src/components/Login.jsx';

describe('components/Login', function() {
  describe('#render', function() {
    const component = TestUtils.renderIntoDocument(
      React.createElement(Login, {onClose: _.noop})
      );
    expect(component).to.be.ok;
  });
});
