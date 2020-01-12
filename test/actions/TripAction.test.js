
const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import AppDispatcher from '../../src/AppDispatcher';
import TripAction from '../../src/actions/TripAction';

describe('actions/TripAction', () => {
  describe('#setCurrentTrip', () => {
    let dispatchStub;
    let loadTripStub;

    beforeEach(() => {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
      loadTripStub = sinon.stub(TripAction, 'loadTrip');
    });

    afterEach(() => {
      loadTripStub.restore();
      dispatchStub.restore();
    });

    it('dispatch is called with right info', () => {
      const testTripId = 'trip-1';
      TripAction.setCurrentTrip(testTripId);

      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(TripAction.Types.TRIP_SET_CURRENT);
      expect(action.data).to.be.equal(testTripId);
    });

    it('loads the current trip data', () => {
      const testTripId = 'trip-1';

      TripAction.setCurrentTrip(testTripId);

      expect(loadTripStub.args[0].length).to.be.equal(1);
      expect(loadTripStub.args[0][0]).to.be.equal(testTripId);
    });
  });

  describe('#initialLoadTrip', () => {
    const firstTripId = 'trip-1';
    let asyncStub;
    let setCurrentTripStub;
    let tripLoadedStub;
    const testData = {
      tripId: firstTripId,
      data: 'more data'
    };

    beforeEach(() => {
      tripLoadedStub = sinon.stub(TripAction, '_tripLoaded');
      setCurrentTripStub = sinon.stub(TripAction, 'setCurrentTrip');
      asyncStub = sinon.stub(utils, 'getAsync').callsFake((url, callback) => {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(() => {
      asyncStub.restore();
      setCurrentTripStub.restore();
      tripLoadedStub.restore();
    });

    it('calls API with current trip', () => {
      TripAction.initialLoadTrip();

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/getTrip.php?current');
    });

    it('calls setCurrentTrip with trip ID', () => {
      TripAction.initialLoadTrip();

      expect(setCurrentTripStub.args.length).to.be.equal(1);
      expect(setCurrentTripStub.args[0].length).to.be.equal(1);
      expect(setCurrentTripStub.args[0][0]).to.be.equal(firstTripId);
    });

    it('calls _tripLoaded with data', () => {
      TripAction.initialLoadTrip();

      expect(tripLoadedStub.args.length).to.be.equal(1);
      expect(tripLoadedStub.args[0].length).to.be.equal(1);
      expect(tripLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#loadTrip', () => {
    const testTripId = 'trip-1';
    let asyncStub;
    let tripLoadedStub;
    const testData = {
      tripId: testTripId,
      data: 'more data'
    };

    beforeEach(() => {
      tripLoadedStub = sinon.stub(TripAction, '_tripLoaded');
      asyncStub = sinon.stub(utils, 'getAsync').callsFake((url, callback) => {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(() => {
      asyncStub.restore();
      tripLoadedStub.restore();
    });

    it('calls API with trip ID', () => {
      TripAction.loadTrip(testTripId);

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/getTrip.php?tripId=' +
                                               testTripId);
    });

    it('calls _tripLoaded with data', () => {
      TripAction.loadTrip(testTripId);

      expect(tripLoadedStub.args.length).to.be.equal(1);
      expect(tripLoadedStub.args[0].length).to.be.equal(1);
      expect(tripLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#loadTripList', () => {
    let asyncStub;
    let tripListLoadedStub;
    const testData = {
      resultSet: [
        'more data'
      ]
    };

    beforeEach(() => {
      tripListLoadedStub = sinon.stub(TripAction, '_tripListLoaded');
      asyncStub = sinon.stub(utils, 'getAsync').callsFake((url, callback) => {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(() => {
      asyncStub.restore();
      tripListLoadedStub.restore();
    });

    it('calls API with trip ID', () => {
      TripAction.loadTripList();

      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.be.equal('api/findTrip.php');
    });

    it('calls _tripListLoaded with data', () => {
      TripAction.loadTripList();

      expect(tripListLoadedStub.args.length).to.be.equal(1);
      expect(tripListLoadedStub.args[0].length).to.be.equal(1);
      expect(tripListLoadedStub.args[0][0]).to.be.deep.eql(testData.resultSet);
    });
  });

  describe('#_tripLoaded', () => {
    let dispatchStub;

    beforeEach(() => {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(() => {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', () => {
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

  describe('#tripListLoaded', () => {
    let dispatchStub;

    beforeEach(() => {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(() => {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', () => {
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
