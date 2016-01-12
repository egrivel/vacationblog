'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');

var JournalActionTypes = require('../../src/actions/JournalAction').Types;

var testTripId1 = '-test-trip-1';

var testJournal1 = {
  tripId: testTripId1,
  journalText: 'journal text 1'
};

var testJournal2 = {
  tripId: testTripId1,
  journalText: 'journal text 2'
};

describe('JournalStore', function() {
  // Always have the journal store available
  beforeEach(function() {
    this.JournalStore = rewire('../../src/stores/JournalStore');
    this.storeCallback = this.JournalStore.__get__('storeCallback');
  });

  // Behavior of an uninitialized trip store
  describe('without journals loaded', function() {
    describe('#getData', function() {
      it('returns empty object when uninitialized', function() {
        expect(this.JournalStore.getData()).to.deep.equal({});
      });
    });
  });

  describe('with journals loaded', function() {
    beforeEach(function() {
      this.storeCallback({
        type: JournalActionTypes.JOURNAL_DATA,
        data: testJournal1
      });
    });

    describe('#getData', function() {
      it('returns loaded journal', function() {
        expect(this.JournalStore.getData()).to.deep.eql(testJournal1);
      });

      it('new journal is available after it was loaded', function() {
        // journal 2 is not yet there
        expect(this.JournalStore.getData()).to.deep.eql(testJournal1);

        // action to load journal 2
        this.storeCallback({
          type: JournalActionTypes.JOURNAL_DATA,
          data: testJournal2
        });

        // journal 2 is now there
        expect(this.JournalStore.getData()).to.not.deep.eql(testJournal1);
        expect(this.JournalStore.getData()).to.deep.eql(testJournal2);
      });

      it('setting existing journal does not emit change', function() {
        var cb = sinon.spy();
        this.JournalStore.addChangeListener(cb);

        this.storeCallback({
          type: JournalActionTypes.JOURNAL_DATA,
          data: testJournal1
        });
        expect(cb.callCount).to.be.equal(1);

        this.JournalStore.removeChangeListener(cb);
      });

      it('setting new journal does emit change', function() {
        var cb = sinon.spy();
        this.JournalStore.addChangeListener(cb);

        this.storeCallback({
          type: JournalActionTypes.JOURNAL_DATA,
          data: testJournal2
        });
        expect(cb.callCount).to.be.equal(1);

        this.JournalStore.removeChangeListener(cb);
      });

      it('sending different action does not emit change', function() {
        var cb = sinon.spy();
        this.JournalStore.addChangeListener(cb);

        this.storeCallback({
          type: 'foo',
          data: testJournal2
        });
        expect(cb.callCount).to.be.equal(0);

        this.JournalStore.removeChangeListener(cb);
      });
    });
  });
});
