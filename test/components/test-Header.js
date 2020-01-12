'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import TripStore from '../../src/stores/TripStore';
import MenuStore from '../../src/stores/MenuStore';
import Header from '../../src/components/Header.jsx';

describe('components/Header', function() {
  const defaultBanner = 'default-banner.png';

  describe('#render with name and banner', function() {
    let tripDataStub;
    let menuDataStub;
    const testName = 'Test Name';
    const testBanner = 'test-banner.jpg';
    const testTripData = {
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
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      const h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain(testName);
    });

    it('includes trip banner', function() {
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      const imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(1);
      expect(imgList[0].src).to.not.be.null;
      expect(imgList[0].src).to.contain(testBanner);

      const divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(0);
    });
  });

  describe('#render with name only', function() {
    let tripDataStub;
    let menuDataStub;
    const testName = 'Test Name';
    const testTripData = {
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
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      const h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain(testName);
    });

    it('does not include trip banner', function() {
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      const imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(0);

      const divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(1);
      expect(divList[0].textContent).to.contain('trip banner image is missing');
    });
  });

  describe('#render with banner only', function() {
    let tripDataStub;
    let menuDataStub;
    const testBanner = 'test-banner.jpg';
    const testTripData = {
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
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      const h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain('Vacation Website');
    });

    it('includes default trip banner', function() {
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      const imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(1);
      expect(imgList[0].src).to.not.be.null;
      expect(imgList[0].src).to.not.contain(testBanner);
      expect(imgList[0].src).to.contain(defaultBanner);

      const divList =
        TestUtils.scryRenderedDOMComponentsWithClass(header, 'dummy-banner');
      expect(divList.length).to.be.equal(0);
    });
  });

  describe('#render without name or banner', function() {
    let tripDataStub;
    let menuDataStub;
    const testTripData = {
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
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));
      const h1 = TestUtils.findRenderedDOMComponentWithTag(header, 'h1');
      expect(h1).to.not.be.null;
      expect(h1.textContent).to.contain('Vacation Website');
    });

    it('includes default banner', function() {
      const header = TestUtils.renderIntoDocument(
        React.createElement(Header, null));

      const imgList = TestUtils.scryRenderedDOMComponentsWithTag(header, 'img');
      expect(imgList.length).to.be.equal(1);
      expect(imgList[0].src).to.not.be.null;
      expect(imgList[0].src).to.contain(defaultBanner);
    });
  });
});
