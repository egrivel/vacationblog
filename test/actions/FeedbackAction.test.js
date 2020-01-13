
const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import AppDispatcher from '../../src/AppDispatcher';
import FeedbackAction from '../../src/actions/FeedbackAction';

describe('actions/FeedbackAction', () => {
  let asyncPostStub;
  let asyncGetStub;
  let dispatchStub;
  const testTripId = 'trip1';
  const testRefId = 'ref1';
  const testUserId = 'user1';
  let testData;

  beforeEach(() => {
    testData = {
      tripId: 'trip2',
      referenceId: 'ref2',
      list: 'list1'
    };

    asyncPostStub = sinon.stub(utils, 'postAsync').callsFake(
      (url, data, cb) => {
        cb();
      });
    asyncGetStub = sinon.stub(utils, 'getAsync').callsFake(
      (url, cb) => {
        cb(JSON.stringify(testData));
      });
    dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
  });

  afterEach(() => {
    dispatchStub.restore();
    asyncPostStub.restore();
    asyncGetStub.restore();
  });

  describe('#loadData', () => {
    it('gets data from server', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
    });

    it('includes correct URL', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
      expect(asyncGetStub.args[0].length).to.be.equal(2);
      expect(asyncGetStub.args[0][0]).to.contain('api/getFeedback.php?');
    });

    it('includes trip ID', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
      expect(asyncGetStub.args[0].length).to.be.equal(2);
      expect(asyncGetStub.args[0][0]).to.contain('tripId=' + testTripId);
    });

    it('includes reference ID', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
      expect(asyncGetStub.args[0].length).to.be.equal(2);
      expect(asyncGetStub.args[0][0]).to.contain('referenceId=' + testRefId);
    });

    it('calls AppDispatcher', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
    });

    it('dispatched action type', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].list).to.exist;
      expect(dispatchStub.args[0][0].type)
        .to.be.equal(FeedbackAction.Types.FEEDBACK_LOAD);
    });

    it('dispatched action tripId', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].list).to.exist;
      expect(dispatchStub.args[0][0].tripId).to.be.equal(testData.tripId);
    });

    it('dispatched action referenceId', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].list).to.exist;
      expect(dispatchStub.args[0][0].referenceId).to.be.equal(
        testData.referenceId);
    });

    it('dispatched action list', () => {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].list).to.exist;
      expect(dispatchStub.args[0][0].list).to.be.equal(testData.list);
    });
  });

  describe('set/clear functions', () => {
    let loadDataStub;

    beforeEach(() => {
      loadDataStub = sinon.stub(FeedbackAction, 'loadData');
    });

    afterEach(() => {
      loadDataStub.restore();
    });

    describe('#setLike', () => {
      describe('do the post', () => {
        it('post to server', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('like');
        });

        it('sends deleted N', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('N');
        });

        it('sends trip ID', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', () => {
        it('makes the call', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', () => {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });

    describe('#clearLike', () => {
      describe('do the post', () => {
        it('post to server', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('like');
        });

        it('sends deleted N', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('Y');
        });

        it('sends trip ID', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', () => {
        it('makes the call', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', () => {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });

    describe('#setPlus', () => {
      describe('do the post', () => {
        it('post to server', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('plus');
        });

        it('sends deleted N', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('N');
        });

        it('sends trip ID', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', () => {
        it('makes the call', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', () => {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });

    describe('#clearPlus', () => {
      describe('do the post', () => {
        it('post to server', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('plus');
        });

        it('sends deleted N', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('Y');
        });

        it('sends trip ID', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          const data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', () => {
        it('makes the call', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', () => {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });
  });
});
