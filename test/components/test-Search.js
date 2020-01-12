'use strict';

const expect = require('chai').expect;
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Search from '../../src/components/Search.jsx';

describe('components/Search', function() {
  describe('#render', function() {
    const component = TestUtils.renderIntoDocument(
      React.createElement(Search, null)
      );
    expect(component).to.be.ok;
  });
});
