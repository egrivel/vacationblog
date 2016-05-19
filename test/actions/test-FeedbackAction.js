'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var AppDispatcher = require('../../src/AppDispatcher');
var FeedbackAction = require('../../src/actions/FeedbackAction');

describe('/actions/FeedbackAction', function() {
  var asyncPostStub;
  var asyncGetStub;
  var dispatchStub;
  var testTripId = 'trip1';
  var testRefId = 'ref1';
  var testUserId = 'user1';
  var testData;

  beforeEach(function() {
    testData = {
      tripId: 'trip2',
      referenceId: 'ref2',
      list: 'list1'
    };

    asyncPostStub = sinon.stub(utils, 'postAsync',
      function(url, data, cb) {
        cb();
      });
    asyncGetStub = sinon.stub(utils, 'getAsync',
      function(url, cb) {
        cb(JSON.stringify(testData));
      });
    dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
  });

  afterEach(function() {
    dispatchStub.restore();
    asyncPostStub.restore();
    asyncGetStub.restore();
  });

  describe('#loadData', function() {
    it('gets data from server', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
    });

    it('includes correct URL', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
      expect(asyncGetStub.args[0].length).to.be.equal(2);
      expect(asyncGetStub.args[0][0]).to.contain('api/getFeedback.php?');
    });

    it('includes trip ID', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
      expect(asyncGetStub.args[0].length).to.be.equal(2);
      expect(asyncGetStub.args[0][0]).to.contain('tripId=' + testTripId);
    });

    it('includes reference ID', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(asyncGetStub.callCount).to.be.equal(1);
      expect(asyncGetStub.args[0].length).to.be.equal(2);
      expect(asyncGetStub.args[0][0]).to.contain('referenceId=' + testRefId);
    });

    it('calls AppDispatcher', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
    });

    it('dispatched action type', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].type).to.be.exit;
      expect(dispatchStub.args[0][0].type).to.be.equal(FeedbackAction.Types.FEEDBACK_LOAD);
    });

    it('dispatched action tripId', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].tripId).to.be.exit;
      expect(dispatchStub.args[0][0].tripId).to.be.equal(testData.tripId);
    });

    it('dispatched action referenceId', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].referenceId).to.be.exit;
      expect(dispatchStub.args[0][0].referenceId).to.be.equal(testData.referenceId);
    });

    it('dispatched action list', function() {
      FeedbackAction.loadData(testTripId, testRefId);
      expect(dispatchStub.callCount).to.be.equal(1);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      expect(dispatchStub.args[0][0].list).to.be.exit;
      expect(dispatchStub.args[0][0].list).to.be.equal(testData.list);
    });
  });

  describe('set/clear functions', function() {
    var loadDataStub;

    beforeEach(function() {
      loadDataStub = sinon.stub(FeedbackAction, 'loadData');
    });

    afterEach(function() {
      loadDataStub.restore();
    });

    describe('#setLike', function() {
      describe('do the post', function() {
        it('post to server', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('like');
        });

        it('sends deleted N', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('N');
        });

        it('sends trip ID', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', function() {
        it('makes the call', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', function() {
          FeedbackAction.setLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });

    describe('#clearLike', function() {
      describe('do the post', function() {
        it('post to server', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('like');
        });

        it('sends deleted N', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('Y');
        });

        it('sends trip ID', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', function() {
        it('makes the call', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', function() {
          FeedbackAction.clearLike(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });

    describe('#setPlus', function() {
      describe('do the post', function() {
        it('post to server', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('plus');
        });

        it('sends deleted N', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('N');
        });

        it('sends trip ID', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', function() {
        it('makes the call', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', function() {
          FeedbackAction.setPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });

    describe('#clearPlus', function() {
      describe('do the post', function() {
        it('post to server', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
        });

        it('correct URL', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          expect(asyncPostStub.args[0].length).to.equal(3);
          expect(asyncPostStub.args[0][0]).to.equal('api/putFeedback.php');
        });

        it('sends type like', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.type).to.exist;
          expect(data.type).to.equal('plus');
        });

        it('sends deleted N', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.deleted).to.exist;
          expect(data.deleted).to.equal('Y');
        });

        it('sends trip ID', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.tripId).to.exist;
          expect(data.tripId).to.equal(testTripId);
        });

        it('sends reference ID', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.referenceId).to.exist;
          expect(data.referenceId).to.equal(testRefId);
        });

        it('sends user ID', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(asyncPostStub.callCount).to.be.equal(1);
          var data = asyncPostStub.args[0][1];
          expect(data.userId).to.exist;
          expect(data.userId).to.equal(testUserId);
        });
      });

      describe('call loadData', function() {
        it('makes the call', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
        });

        it('passes trip ID', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][0]).to.equal(testTripId);
        });

        it('passes reference ID', function() {
          FeedbackAction.clearPlus(testTripId, testRefId, testUserId);
          expect(loadDataStub.callCount).to.be.equal(1);
          expect(loadDataStub.args[0].length).to.equal(2);
          expect(loadDataStub.args[0][1]).to.equal(testRefId);
        });
      });
    });
  });
});
