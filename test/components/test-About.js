'use strict';

const expect = require('chai').expect;
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import About from '../../src/components/About.jsx';

describe('components/About', function() {
  describe('#render', function() {
    const component = TestUtils.renderIntoDocument(
      React.createElement(About, null)
      );
    expect(component).to.be.ok;
  });
});
