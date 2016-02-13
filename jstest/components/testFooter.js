'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var TripStore = require('../../src/stores/TripStore');
var Footer = require('../../src/components/Footer');

describe('Footer component', function() {
  var standardFooter = 'Website design \u00a92015-16 by Eric Grivel.';

  describe('render with different start and end date', function() {
    var testYear1 = '2012';
    var testYear2 = '2013';
    var testTripData = {
      startDate: testYear1 + '-03-01',
      endDate: testYear2 + '-03-31'
    };

    var tripDataStub;

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
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text =
          TestUtils.findRenderedDOMComponentWithTag(footer, 'div').textContent;
        expect(text).to.contain('Content copyright \u00a9' +
                                 testYear1 + '-' + testYear2 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render with same start and end year', function() {
    var testYear1 = '2014';
    var testYear2 = '2014';
    var testTripData = {
      startDate: testYear1 + '-03-01',
      endDate: testYear2 + '-03-31'
    };

    var tripDataStub;

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
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 testYear1 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render without an end year', function() {
    var testYear1 = '2015';
    var testTripData = {
      startDate: testYear1 + '-03-01'
    };

    var tripDataStub;

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
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 testYear1 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render without start year', function() {
    var testYear2 = '2014';
    var testTripData = {
      endDate: testYear2 + '-03-31'
    };

    var tripDataStub;

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
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 testYear2 +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });

  describe('render without start or end year', function() {
    var testTripData = {
    };

    var tripDataStub;

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
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain('Content copyright \u00a9' +
                                 ' by the respective authors.');
      });

      it('contains website copyright', function() {
        var footer = TestUtils.renderIntoDocument(
          React.createElement(Footer, null));
        var text = TestUtils.findRenderedDOMComponentWithTag(footer, 'div');
        var text2 = text.textContent;
        expect(text2).to.contain(standardFooter);
        expect(text2).to.contain('All rights reserved.');
      });
    });
  });
});
