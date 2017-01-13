'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const TripStore = require('../../src/stores/TripStore');
const TripActionTypes = require('../../src/actions/TripAction').Types;

const testTripId1 = '-test-trip-1';
const testTripId2 = '-test-trip-2';

const testTripList = [
  testTripId1,
  testTripId2
];

const testTripData1 = {
  tripId: testTripId1,
  tripText: 'trip text 1'
};

const testTripData2 = {
  tripId: testTripId2,
  tripText: 'trip text 2'
};

describe('stores/TripStore', function() {
  // Always have the trip store available
  beforeEach(function() {
    TripStore.removeAllListeners();
    TripStore._reset();
  });

  afterEach(function() {
    TripStore.removeAllListeners();
  });

  // Behavior of an uninitialized trip store
  describe('without current trip set', function() {
    describe('#getCurrentTripId', function() {
      it('returns blank when uninitialized', function() {
        expect(TripStore.getCurrentTripId()).to.equal('');
      });

      describe('action: set current trip', function() {
        it('works on uninitialized store', function() {
          const cb = sinon.spy();
          TripStore.addChangeListener(cb);

          TripStore._storeCallback({
            type: TripActionTypes.TRIP_SET_CURRENT,
            data: testTripId1
          });

          expect(cb.callCount).to.be.equal(1);
          expect(TripStore.getCurrentTripId()).to.deep.eql(testTripId1);

          TripStore.removeChangeListener(cb);
        });
      });
    });

    describe('#getTripData', function() {
      it('returns empty object when uninitialized', function() {
        expect(TripStore.getTripData()).to.deep.equal({});
      });

      // Without a trip ID, loading data should not work. Any load data
      // action should be totally ignored.
      describe('action: load data', function() {
        it('fails on uninitialized store', function() {
          const cb = sinon.spy();
          TripStore.addChangeListener(cb);

          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_DATA,
            data: testTripData1
          });
          expect(cb.callCount).to.be.equal(0);
          expect(TripStore.getTripData()).to.deep.eql({});

          TripStore.removeChangeListener(cb);
        });
      });
    });

    describe('#getTripList', function() {
      it('returns empty list uninitialized', function() {
        expect(TripStore.getTripList()).to.deep.equal([]);
      });

      describe('action: load list', function() {
        it('works on uninitialized store', function() {
          const cb = sinon.spy();
          TripStore.addChangeListener(cb);

          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_LIST,
            data: testTripList
          });

          expect(cb.callCount).to.be.equal(1);
          expect(TripStore.getTripList()).to.deep.eql(testTripList);

          TripStore.removeChangeListener(cb);
        });
      });
    });
  });

  // Trip store initialized with a current trip
  describe('with current trip set', function() {
    beforeEach(function() {
      TripStore._storeCallback({
        type: TripActionTypes.TRIP_SET_CURRENT,
        data: testTripId1
      });
    });

    describe('#getCurrentTripId', function() {
      it('returns current trip', function() {
        expect(TripStore.getCurrentTripId()).to.equal(testTripId1);
      });

      it('returns new trip when updated', function() {
        TripStore._storeCallback({
          type: TripActionTypes.TRIP_SET_CURRENT,
          data: testTripId2
        });
        expect(TripStore.getCurrentTripId()).to.equal(testTripId2);
      });

      describe('action: set current trip', function() {
        it('changing current trip emits change', function() {
          const cb = sinon.spy();

          // Start listening to the callback
          TripStore.addChangeListener(cb);

          // Set a current trip emits a change
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_SET_CURRENT,
            data: testTripId2
          });
          expect(cb.callCount).to.be.equal(1);

          // Set a current trip again does not emit a change
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_SET_CURRENT,
            data: testTripId2
          });
          expect(cb.callCount).to.be.equal(1);

          // Set a different trip back emits a change
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_SET_CURRENT,
            data: testTripId1
          });
          expect(cb.callCount).to.be.equal(2);

          TripStore.removeChangeListener(cb);
        });
      });
    });

    describe('#getTripData', function() {
      beforeEach(function() {
        TripStore._storeCallback({
          type: TripActionTypes.TRIP_LOAD_DATA,
          data: testTripData1
        });
      });

      it('returns data when initialized', function() {
        expect(TripStore.getTripData()).to.deep.eql(testTripData1);
      });

      it('returns new data when updated', function() {
        // second data packet is with same trip Id but different data

        // initially, the data is trip data 1, not trip data 2
        expect(TripStore.getTripData()).to.deep.eql(testTripData1);
        expect(TripStore.getTripData()).to.not.deep.eql(testTripData2);

        const testTripData = {
          tripId: testTripId1,
          tripText: 'trip text 2'
        };

        // Update the data with testTripData2 and make sure that is returned
        TripStore._storeCallback({
          type: TripActionTypes.TRIP_LOAD_DATA,
          data: testTripData
        });
        expect(TripStore.getTripData()).to.not.deep.eql(testTripData1);
        expect(TripStore.getTripData()).to.deep.eql(testTripData);
      });

      describe('action: load data', function() {
        it('data is not updated if not for the right tripId', function() {
          // data packet is with different trip ID

          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_DATA,
            data: testTripData2
          });

          // after initialization with testTripData1, that data is returned
          // not testTripData2
          expect(TripStore.getTripData()).to.deep.eql(testTripData1);
          expect(TripStore.getTripData()).to.not.deep.eql(testTripData2);
        });

        it('emits change if new data is set', function() {
          const cb = sinon.spy();

          // Start listening to the callback
          TripStore.addChangeListener(cb);

          // create a different data object to test behavior
          const testData = {
            tripId: testTripId1,
            tripText: 'other test text'
          };

          // Load data should emit a change event
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_DATA,
            data: testData
          });
          expect(cb.callCount).to.be.equal(1);

          // Loading again with the same data does not emit change
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_DATA,
            data: testData
          });
          expect(cb.callCount).to.be.equal(1);

          // Loading with a different tripId does not emit change
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_DATA,
            data: testTripData2
          });
          expect(cb.callCount).to.be.equal(1);

          // Unknown action does not emit change
          TripStore._storeCallback({
            type: 'foo',
            data: testTripData2
          });
          expect(cb.callCount).to.be.equal(1);

          TripStore.removeChangeListener(cb);
        });
      });
    });

    describe('#getTripList', function() {
      beforeEach(function() {
        TripStore._storeCallback({
          type: TripActionTypes.TRIP_LOAD_LIST,
          data: testTripList
        });
      });

      it('returns trip list', function() {
        expect(TripStore.getTripList()).to.deep.eql(testTripList);
      });

      describe('action: load list', function() {
        it('returns new trip list when updated', function() {
          const cb = sinon.spy();
          TripStore.addChangeListener(cb);

          expect(TripStore.getTripList()).to.deep.eql(testTripList);

          // create a different list to test behavior
          const otherList = [
            testTripId2,
            testTripId1
          ];

          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_LIST,
            data: otherList
          });
          expect(cb.callCount).to.be.equal(1);
          expect(TripStore.getTripList()).to.not.deep.eql(testTripList);
          expect(TripStore.getTripList()).to.deep.eql(otherList);

          // setting the trip list again does not have any effect
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_LIST,
            data: otherList
          });
          expect(cb.callCount).to.be.equal(1);
          expect(TripStore.getTripList()).to.deep.eql(otherList);

          // setting back to original list does work
          TripStore._storeCallback({
            type: TripActionTypes.TRIP_LOAD_LIST,
            data: testTripList
          });
          expect(cb.callCount).to.be.equal(2);
          expect(TripStore.getTripList()).to.deep.eql(testTripList);
          expect(TripStore.getTripList()).to.not.deep.eql(otherList);

          TripStore.removeChangeListener(cb);
        });
      });
    });
  });
});
