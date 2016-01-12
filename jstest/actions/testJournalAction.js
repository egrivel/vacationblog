'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var AppDispatcher = require('../../src/AppDispatcher');
var JournalAction = require('../../src/actions/JournalAction');

describe('JournalAction stuff', function() {
  describe('#loadJournal', function() {
    var asyncStub;
    var journalLoadedStub;
    var testData = {
      test1: 'data1'
    };

    beforeEach(function() {
      journalLoadedStub = sinon.stub(JournalAction, '_journalLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      journalLoadedStub.restore();
    });

    it('calls API with trip and journal ID', function() {
      var testTripId = 'trip1';
      var testJournalId = 'ref1';
      JournalAction.loadJournal(testTripId, testJournalId);
      // This results in two calls, one to read the trip data, the other
      // to read the journal
      expect(asyncStub.args.length).to.be.equal(2);
      expect(asyncStub.args[1].length).to.be.equal(2);
      expect(asyncStub.args[1][0]).to.match(/^api\/getJournal.php\?/);
      expect(asyncStub.args[1][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[1][0]).to.contain('journalId=' + testJournalId);
    });

    it('calls API with trip ID and latest when no journal ID', function() {
      var testTripId = 'trip1';
      JournalAction.loadJournal(testTripId);
      // This results in two calls, one to read the trip data, the other
      // to read the journal
      expect(asyncStub.args.length).to.be.equal(2);
      expect(asyncStub.args[1].length).to.be.equal(2);
      expect(asyncStub.args[1][0]).to.match(/^api\/getJournal.php\?/);
      expect(asyncStub.args[1][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[1][0]).to.contain('latest');
    });

    it('calls _journalLoaded with right params', function() {
      var testTripId = 'trip1';
      var testJournalId = 'journal1';
      JournalAction.loadJournal(testTripId, testJournalId);
      expect(journalLoadedStub.args[0].length).to.be.equal(1);
      expect(journalLoadedStub.args[0][0]).to.be.eql(testData);
    });
  });

  describe('#_journalLoaded', function() {
    var dispatchStub;
    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      var data = {
        count: 1,
        list: [
          {
            data: 'foo'
          }
        ]
      };
      JournalAction._journalLoaded(data);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(JournalAction.Types.JOURNAL_DATA);
      expect(action.data).to.be.deep.eql(data);
    });
  });
});
