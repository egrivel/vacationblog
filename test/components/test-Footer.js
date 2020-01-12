'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import TripStore from '../../src/stores/TripStore';
import Footer from '../../src/components/Footer.jsx';

describe('components/Footer', function() {
  const standardFooter = 'Website design \u00a92015-16 by Eric Grivel.';

  describe('render with different start and end date', function() {
    const testYear1 = '2012';
    const testYear2 = '2013';
    const testTripData = {
      startDate: testYear1 + '-03-01',
      endDate: testYear2 + '-03-31'
    };

    let tripDataStub;

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
    });

    afterEach(function() {
      tripDataStub.restore();
    });

    describe('#render with DOM component', function() {
      it('contains content copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text =
          TestUtils.findRenderedDOMComponentWithTag(footer, 'div').textContent;
        expect(text).to.contain('Content copyright \u00a9' +
                                 testYear1 + '-' + testYear2 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render with same start and end year', function() {
    const testYear1 = '2014';
    const testYear2 = '2014';
    const testTripData = {
      startDate: testYear1 + '-03-01',
      endDate: testYear2 + '-03-31'
    };

    let tripDataStub;

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
    });

    afterEach(function() {
      tripDataStub.restore();
    });

    describe('#render with DOM component', function() {
      it('contains content copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 testYear1 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render without an end year', function() {
    const testYear1 = '2015';
    const testTripData = {
      startDate: testYear1 + '-03-01'
    };

    let tripDataStub;

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
    });

    afterEach(function() {
      tripDataStub.restore();
    });

    describe('#render with DOM component', function() {
      it('contains content copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 testYear1 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render without start year', function() {
    const testYear2 = '2014';
    const testTripData = {
      endDate: testYear2 + '-03-31'
    };

    let tripDataStub;

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
    });

    afterEach(function() {
      tripDataStub.restore();
    });

    describe('#render with DOM component', function() {
      it('contains content copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 testYear2 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render without start or end year', function() {
    const testTripData = {
    };

    let tripDataStub;

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
    });

    afterEach(function() {
      tripDataStub.restore();
    });

    describe('#render with DOM component', function() {
      it('contains content copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        const footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        const text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        const text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });
});
