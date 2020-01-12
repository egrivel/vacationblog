'use strict';

import sinon from 'sinon';
const expect = require('chai').expect;
import React from 'react';
// var ReactDOMServer = require('react-dom/server');
import TestUtils from 'react-addons-test-utils';

import JournalPrevNext from '../../src/components/JournalPrevNext.jsx';

describe('components/JournalPrevNext', function() {
  const testTripId1 = 'test-trip-1';
  // var testTripId2 = 'test-trip-2';
  const testPrevId1 = 'test-prev-1';
  // var testPrevId2 = 'test-prev-2';
  const testNextId1 = 'test-next-1';
  // var testNextId2 = 'test-next-2';
  const testNr1 = 1454;
  // var testNr2 = 1455;
  let props;

  beforeEach(function() {
    props = {
      tripId: testTripId1,
      prevId: testPrevId1,
      nextId: testNextId1,
      nr: testNr1
    };
  });

  describe('#propTypes', function() {
    let logStub;

    beforeEach(function() {
      // React will give errors about the proptyps on the error console,
      // so stub that to capture the error messages
      logStub = sinon.stub(console, 'error');
    });

    afterEach(function() {
      logStub.restore();
    });

    it('accepts valid props', function() {
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(0);
    });

    it('error on missing tripId', function() {
      delete props.tripId;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      // check that the error message about a required prop is given
      expect(logStub.args[0][0]).to.contain('Required prop');
      // check that the error message is actually about this prop
      expect(logStub.args[0][0]).to.contain('`tripId`');
    });

    it('error on non-string tripId', function() {
      props.tripId = true;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`tripId`');
    });

    it('no error on missing prevId', function() {
      delete props.prevId;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(0);
      // expect(logStub.args[0].length).to.be.equal(1);
      // // check that the error message about a required prop is given
      // expect(logStub.args[0][0]).to.contain('Required prop');
      // // check that the error message is actually about this prop
      // expect(logStub.args[0][0]).to.contain('`prevId`');
    });

    it('error on non-string prevId', function() {
      props.prevId = true;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`prevId`');
    });

    it('no error on missing nextId', function() {
      delete props.nextId;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(0);
      // expect(logStub.args[0].length).to.be.equal(1);
      // // check that the error message about a required prop is given
      // expect(logStub.args[0][0]).to.contain('Required prop');
      // // check that the error message is actually about this prop
      // expect(logStub.args[0][0]).to.contain('`nextId`');
    });

    it('error on non-string nextId', function() {
      props.nextId = true;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`nextId`');
    });

    it('error on missing nr', function() {
      delete props.nr;
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      // check that the error message about a required prop is given
      expect(logStub.args[0][0]).to.contain('Required prop');
      // check that the error message is actually about this prop
      expect(logStub.args[0][0]).to.contain('`nr`');
    });

    it('error on non-number nr', function() {
      props.nr = '12345';
      React.createElement(JournalPrevNext, props);
      expect(logStub.callCount).to.be.equal(1);
      expect(logStub.args[0].length).to.be.equal(1);
      expect(logStub.args[0][0]).to.contain('Invalid prop');
      expect(logStub.args[0][0]).to.contain('`nr`');
    });
  });

  describe('#render', function() {
    it('renders a prevnext paragraph', function() {
      const component =
        TestUtils.renderIntoDocument(
          React.createElement(JournalPrevNext, props));
      const p = TestUtils.findRenderedDOMComponentWithTag(
        component,
        'p'
      );
      expect(p).to.not.be.null;
      expect(p.className).to.be.equal('prevnext');
    });
  });
});
