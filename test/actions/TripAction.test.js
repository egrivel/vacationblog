'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import AppDispatcher from '../../src/AppDispatcher';
import TripAction from '../../src/actions/TripAction';

describe('actions/TripAction', function() {
  describe('#setCurrentTrip', function() {
    let dispatchStub;
    let loadTripStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
      loadTripStub = sinon.stub(TripAction, 'loadTrip');
    });

    afterEach(function() {
      loadTripStub.restore();
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      const testTripId = 'trip-1';
      TripAction.setCurrentTrip(testTripId);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_SET_CURRENT);
      expect(action.data).to.be.equal(testTripId);
    });

    it('loads the current trip data', function() {
      const testTripId = 'trip-1';

      TripAction.setCurrentTrip(testTripId);

      expect(loadTripStub.args[0].length).to.be.equal(1);
      expect(loadTripStub.args[0][0]).to.be.equal(testTripId);
    });
  });

  describe('#initialLoadTrip', function() {
    const firstTripId = 'trip-1';
    let asyncStub;
    let setCurrentTripStub;
    let tripLoadedStub;
    const testData = {
      tripId: firstTripId,
      data: 'more data'
    };

    beforeEach(function() {
      tripLoadedStub = sinon.stub(TripAction, '_tripLoaded');
      setCurrentTripStub = sinon.stub(TripAction, 'setCurrentTrip');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      setCurrentTripStub.restore();
      tripLoadedStub.restore();
    });

    it('calls API with current trip', function() {
      TripAction.initialLoadTrip();

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/getTrip.php?current');
    });

    it('calls setCurrentTrip with trip ID', function() {
      TripAction.initialLoadTrip();

      expect(setCurrentTripStub.args.length).to.be.equal(1);
      expect(setCurrentTripStub.args[0].length).to.be.equal(1);
      expect(setCurrentTripStub.args[0][0]).to.be.equal(firstTripId);
    });

    it('calls _tripLoaded with data', function() {
      TripAction.initialLoadTrip();

      expect(tripLoadedStub.args.length).to.be.equal(1);
      expect(tripLoadedStub.args[0].length).to.be.equal(1);
      expect(tripLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#loadTrip', function() {
    const testTripId = 'trip-1';
    let asyncStub;
    let tripLoadedStub;
    const testData = {
      tripId: testTripId,
      data: 'more data'
    };

    beforeEach(function() {
      tripLoadedStub = sinon.stub(TripAction, '_tripLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      tripLoadedStub.restore();
    });

    it('calls API with trip ID', function() {
      TripAction.loadTrip(testTripId);

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/getTrip.php?tripId=' +
                                               testTripId);
    });

    it('calls _tripLoaded with data', function() {
      TripAction.loadTrip(testTripId);

      expect(tripLoadedStub.args.length).to.be.equal(1);
      expect(tripLoadedStub.args[0].length).to.be.equal(1);
      expect(tripLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#loadTripList', function() {
    let asyncStub;
    let tripListLoadedStub;
    const testData = {
      resultSet: [
        'more data'
      ]
    };

    beforeEach(function() {
      tripListLoadedStub = sinon.stub(TripAction, '_tripListLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      tripListLoadedStub.restore();
    });

    it('calls API with trip ID', function() {
      TripAction.loadTripList();

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/findTrip.php');
    });

    it('calls _tripListLoaded with data', function() {
      TripAction.loadTripList();

      expect(tripListLoadedStub.args.length).to.be.equal(1);
      expect(tripListLoadedStub.args[0].length).to.be.equal(1);
      expect(tripListLoadedStub.args[0][0]).to.be.deep.eql(testData.resultSet);
    });
  });

  describe('#_tripLoaded', function() {
    let dispatchStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      const data = {
        data: 'some data'
      };
      TripAction._tripLoaded(data);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_LOAD_DATA);
      expect(action.data).to.be.deep.eql(data);
    });
  });

  describe('#tripListLoaded', function() {
    let dispatchStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      const data = {
        data: 'some data'
      };
      TripAction._tripListLoaded(data);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_LOAD_LIST);
      expect(action.data).to.be.deep.eql(data);
    });
  });
});
