'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
// var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var JournalWrapper = require('../../src/components/JournalWrapper.jsx');
var JournalAction = require('../../src/actions/JournalAction');
var CommentAction = require('../../src/actions/CommentAction');
var JournalStore = require('../../src/stores/JournalStore');

describe('src/components/JournalWrapper', function() {
  var loadJournalStub;
  var loadCommentsStub;
  var journalGetDataStub;
  var dummyData;

  beforeEach(function() {
    dummyData = {};
    JournalStore.removeAllListeners();
    loadJournalStub = sinon.stub(JournalAction, 'loadJournal');
    loadCommentsStub = sinon.stub(CommentAction, 'recursivelyLoadComments');
    journalGetDataStub = sinon.stub(JournalStore, 'getData',
      function() {
        return dummyData;
      });
  });

  afterEach(function() {
    journalGetDataStub.restore();
    loadCommentsStub.restore();
    loadJournalStub.restore();
    JournalStore.removeAllListeners();
  });

  describe('render without data', function() {
    it('load journal is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, null));
      expect(loadJournalStub.callCount).to.be.equal(0);
    });
    it('load comments is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, null));
      expect(loadCommentsStub.callCount).to.be.equal(0);
    });
  });

  describe('render with data, no props', function() {
    var testTripId = 'test-trip-1';
    var testJournalId = 'test-journal-id';

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
    it('load comments is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, null));
      expect(loadCommentsStub.callCount).to.be.equal(0);
    });
  });

  describe('render without data, with incomplete props', function() {
    var props = {};

    beforeEach(function() {
      props.params = {};
    });

    it('load journal is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(0);
    });

    it('load comments is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadCommentsStub.callCount).to.be.equal(0);
    });
  });

  describe('render without data, with complete props', function() {
    var testTripId = 'test-trip-1';
    var testJournalId = 'test-journal-id';
    var props = {};

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

    it('load comments is called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadCommentsStub.callCount).to.be.equal(1);
    });

    it('load comments has correct parametesr', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadCommentsStub.args[0][0]).to.be.equal(testTripId);
      expect(loadCommentsStub.args[0][1]).to.be.equal(testJournalId);
    });
  });

  describe('render with different data, and props', function() {
    var testTripId = 'test-trip-1';
    var testJournalId = 'test-journal-id';
    var props = {};

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

    it('load comments is called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadCommentsStub.callCount).to.be.equal(1);
    });
  });

  describe('render with same data, and props', function() {
    var testTripId = 'test-trip-1';
    var testJournalId = 'test-journal-id';
    var props = {};

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

    it('load comments is not called', function() {
      TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadCommentsStub.callCount).to.be.equal(0);
    });
  });

  describe('when props are changed', function() {
    var testTripId1 = 'test-trip-1';
    var testJournalId1 = 'test-journal-id-1';
    var testTripId2 = 'test-trip-2';
    var testJournalId2 = 'test-journal-id-2';
    var props = {};

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
      var component = TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadJournalStub.callCount).to.be.equal(1);
      component.setProps(props);
      expect(loadJournalStub.callCount).to.be.equal(2);
    });

    it('load comments is called twice', function() {
      var component = TestUtils.renderIntoDocument(
        React.createElement(JournalWrapper, props));
      expect(loadCommentsStub.callCount).to.be.equal(1);
      component.setProps(props);
      expect(loadCommentsStub.callCount).to.be.equal(2);
    });
  });
});
