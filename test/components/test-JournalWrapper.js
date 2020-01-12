'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-addons-test-utils';

import JournalWrapper from '../../src/components/JournalWrapper.jsx';
import JournalAction from '../../src/actions/JournalAction';
import FeedbackAction from '../../src/actions/FeedbackAction';
import JournalStore from '../../src/stores/JournalStore';

describe('components/JournalWrapper', function() {
  let loadJournalStub;
  let journalGetDataStub;
  let loadFeedbackStub;
  let dummyData;

  beforeEach(function() {
    dummyData = {};
    JournalStore.removeAllListeners();
    loadJournalStub = sinon.stub(JournalAction, 'loadJournal');
    journalGetDataStub = sinon.stub(JournalStore, 'getData',
      function() {
        return dummyData;
      });
    loadFeedbackStub = sinon.stub(FeedbackAction, 'loadData');
  });

  afterEach(function() {
    journalGetDataStub.restore();
    loadJournalStub.restore();
    JournalStore.removeAllListeners();
    loadFeedbackStub.restore();
  });

  describe('render without data', function() {
    it('load journal is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, null));
      expect(loadJournalStub.callCount).to.be.equal(0);
    });
  });

  describe('render with data, no props', function() {
    const testTripId = 'test-trip-1';
    const testJournalId = 'test-journal-id';

    beforeEach(function() {
      dummyData = {
        tripId: testTripId,
        journalId: testJournalId
      };
    });

    it('load journal is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, null));
      expect(loadJournalStub.callCount).to.be.equal(0);
    });
  });

  describe('render without data, with incomplete props', function() {
    const props = {};

    beforeEach(function() {
      props.params = {};
    });

    it('load journal is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(0);
    });
  });

  describe('render without data, with complete props', function() {
    const testTripId = 'test-trip-1';
    const testJournalId = 'test-journal-id';
    const props = {};

    beforeEach(function() {
      props.params = {
        tripId: testTripId,
        journalId: testJournalId
      };
    });

    it('load journal is called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(1);
    });

    it('load journal has correct parameters', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.args[0][0]).to.be.equal(testTripId);
      expect(loadJournalStub.args[0][1]).to.be.equal(testJournalId);
    });
  });

  describe('render with different data, and props', function() {
    const testTripId = 'test-trip-1';
    const testJournalId = 'test-journal-id';
    const props = {};

    beforeEach(function() {
      dummyData = {
        tripId: testTripId,
        journalId: testJournalId
      };
      props.params = {
        tripId: testTripId + 'x',
        journalId: testJournalId + 'x'
      };
    });

    it('load journal is called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(1);
    });
  });

  describe('render with same data, and props', function() {
    const testTripId = 'test-trip-1';
    const testJournalId = 'test-journal-id';
    const props = {};

    beforeEach(function() {
      dummyData = {
        tripId: testTripId,
        journalId: testJournalId
      };
      props.params = {
        tripId: testTripId,
        journalId: testJournalId
      };
    });

    it('load journal is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(0);
    });
  });

  describe('when props are changed', function() {
    const testTripId1 = 'test-trip-1';
    const testJournalId1 = 'test-journal-id-1';
    const testTripId2 = 'test-trip-2';
    const testJournalId2 = 'test-journal-id-2';
    const props = {};

    beforeEach(function() {
      dummyData = {
        tripId: testTripId1,
        journalId: testJournalId1
      };
      props.params = {
        tripId: testTripId2,
        journalId: testJournalId2
      };
    });

    it('load journal is called twice', function() {
      const component = TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(1);
      component.setProps(props);
      expect(loadJournalStub.callCount).to.be.equal(2);
    });
  });
});
