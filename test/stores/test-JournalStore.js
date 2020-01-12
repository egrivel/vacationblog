'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';

import JournalStore from '../../src/stores/JournalStore';
const JournalActionTypes = require('../../src/actions/JournalAction').Types;

const testTripId1 = '-test-trip-1';

const testJournal1 = {
  tripId: testTripId1,
  journalText: 'journal text 1'
};

const testJournal2 = {
  tripId: testTripId1,
  journalText: 'journal text 2'
};

describe('stores/JournalStore', function() {
  beforeEach(function() {
    JournalStore.removeAllListeners();
    JournalStore._reset();
  });

  afterEach(function() {
    JournalStore.removeAllListeners();
  });

  // Behavior of an uninitialized trip store
  describe('without journals loaded', function() {
    describe('#getData', function() {
      it('returns empty object when uninitialized', function() {
        expect(JournalStore.getData()).to.deep.equal({});
      });
    });
  });

  describe('with journals loaded', function() {
    beforeEach(function() {
      JournalStore._storeCallback({
        type: JournalActionTypes.JOURNAL_DATA,
        data: testJournal1
      });
    });

    describe('#getData', function() {
      it('returns loaded journal', function() {
        expect(JournalStore.getData()).to.deep.eql(testJournal1);
      });

      it('new journal is available after it was loaded', function() {
        // journal 2 is not yet there
        expect(JournalStore.getData()).to.deep.eql(testJournal1);

        // action to load journal 2
        JournalStore._storeCallback({
          type: JournalActionTypes.JOURNAL_DATA,
          data: testJournal2
        });

        // journal 2 is now there
        expect(JournalStore.getData()).to.not.deep.eql(testJournal1);
        expect(JournalStore.getData()).to.deep.eql(testJournal2);
      });

      it('setting existing journal does not emit change', function() {
        const cb = sinon.spy();
        JournalStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        JournalStore._storeCallback({
          type: JournalActionTypes.JOURNAL_DATA,
          data: testJournal1
        });
        expect(cb.callCount).to.be.equal(0);
      });

      it('setting existing journal with new content does emit change',
        function() {
          const cb = sinon.spy();
          JournalStore.addChangeListener(cb);

          testJournal1.journalText = 'some other text';
          expect(cb.callCount).to.be.equal(0);
          JournalStore._storeCallback({
            type: JournalActionTypes.JOURNAL_DATA,
            data: testJournal1
          });
          expect(cb.callCount).to.be.equal(1);
        }
      );

      it('setting new journal does emit change', function() {
        const cb = sinon.spy();
        JournalStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        JournalStore._storeCallback({
          type: JournalActionTypes.JOURNAL_DATA,
          data: testJournal2
        });
        expect(cb.callCount).to.be.equal(1);

        JournalStore.removeChangeListener(cb);
      });

      it('sending different action does not emit change', function() {
        const cb = sinon.spy();
        JournalStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        JournalStore._storeCallback({
          type: 'foo',
          data: testJournal2
        });
        expect(cb.callCount).to.be.equal(0);

        JournalStore.removeChangeListener(cb);
      });
    });
  });
});
