'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var AppDispatcher = require('../../src/AppDispatcher');
var TripAction = require('../../src/actions/TripAction');

describe('actions/TripAction', function() {
  describe('#setCurrentTrip', function() {
    var dispatchStub;
    var loadTripStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
      loadTripStub = sinon.stub(TripAction, 'loadTrip');
    });

    afterEach(function() {
      loadTripStub.restore();
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      var testTripId = 'trip-1';
      TripAction.setCurrentTrip(testTripId);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_SET_CURRENT);
      expect(action.data).to.be.equal(testTripId);
    });

    it('loads the current trip data', function() {
      var testTripId = 'trip-1';

      TripAction.setCurrentTrip(testTripId);

      expect(loadTripStub.args[0].length).to.be.equal(1);
      expect(loadTripStub.args[0][0]).to.be.equal(testTripId);
    });
  });

  describe('#initialLoadTrip', function() {
    var firstTripId = 'trip-1';
    var asyncStub;
    var setCurrentTripStub;
    var tripLoadedStub;
    var testData = {
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
    var testTripId = 'trip-1';
    var asyncStub;
    var tripLoadedStub;
    var testData = {
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
    var asyncStub;
    var tripListLoadedStub;
    var testData = {
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
    var dispatchStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      var data = {
        data: 'some data'
      };
      TripAction._tripLoaded(data);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_LOAD_DATA);
      expect(action.data).to.be.deep.eql(data);
    });
  });

  describe('#tripListLoaded', function() {
    var dispatchStub;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      var data = {
        data: 'some data'
      };
      TripAction._tripListLoaded(data);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_LOAD_LIST);
      expect(action.data).to.be.deep.eql(data);
    });
  });
});
