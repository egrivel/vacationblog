'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var TripStore = require('../../src/stores/TripStore');
var MenuStore = require('../../src/stores/MenuStore');
var Header = require('../../src/components/Header');

describe('Header component', function() {
  describe('#render with name and banner', function() {
    var tripDataStub;
    var menuDataStub;
    var testName = 'Test Name';
    var testBanner = 'test-banner.jpg';
    var testTripData = {
      name: testName,
      bannerImg: testBanner
    };

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
      menuDataStub = sinon.stub(MenuStore, 'getData');
    });

    afterEach(function() {
      menuDataStub.restore();
      tripDataStub.restore();
    });

    it('includes trip name', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      var h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain(testName);
    });

    it('includes trip banner', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(1);
      expect(imgList[0].src).to.not.be.null;
      expect(imgList[0].src).to.contain(testBanner);

      var divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(0);
    });
  });

  describe('#render with name only', function() {
    var tripDataStub;
    var menuDataStub;
    var testName = 'Test Name';
    var testTripData = {
      name: testName
    };

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
      menuDataStub = sinon.stub(MenuStore, 'getData');
    });

    afterEach(function() {
      menuDataStub.restore();
      tripDataStub.restore();
    });

    it('includes trip name', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      var h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain(testName);
    });

    it('does not include trip banner', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(0);

      var divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(1);
      expect(divList[0].textContent).to.contain('trip banner image is missing');
    });
  });

  describe('#render with banner only', function() {
    var tripDataStub;
    var menuDataStub;
    var testBanner = 'test-banner.jpg';
    var testTripData = {
      bannerImg: testBanner
    };

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
      menuDataStub = sinon.stub(MenuStore, 'getData');
    });

    afterEach(function() {
      menuDataStub.restore();
      tripDataStub.restore();
    });

    it('does not include trip name', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      var h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain('Vacation Website');
    });

    it('includes trip banner', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(1);
      expect(imgList[0].src).to.not.be.null;
      expect(imgList[0].src).to.contain(testBanner);

      var divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(0);
    });
  });

  describe('#render without name or banner', function() {
    var tripDataStub;
    var menuDataStub;
    var testTripData = {
    };

    beforeEach(function() {
      tripDataStub = sinon.stub(TripStore, 'getTripData',
                                 function() {
                                   return testTripData;
                                 });
      menuDataStub = sinon.stub(MenuStore, 'getData');
    });

    afterEach(function() {
      menuDataStub.restore();
      tripDataStub.restore();
    });

    it('does not include trip name', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      var h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain('Vacation Website');
    });

    it('does not include trip banner', function() {
      var header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      var imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(0);

      var divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(1);
      expect(divList[0].textContent).to.contain('trip banner image is missing');
    });
  });
});
