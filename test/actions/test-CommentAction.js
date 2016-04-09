'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var AppDispatcher = require('../../src/AppDispatcher');
var CommentAction = require('../../src/actions/CommentAction');
var UserAction = require('../../src/actions/UserAction');

describe('CommentAction stuff', function() {
  var loadUserStub;

  beforeEach(function() {
    // Comment actions load users, when needed. Stub out this function.
    loadUserStub = sinon.stub(UserAction, 'loadUser');
  });

  afterEach(function() {
    loadUserStub.restore();
  });

  describe('#loadComments', function() {
    var asyncStub;
    var commentsLoadedStub;
    var testData = {
      test1: 'data1'
    };

    beforeEach(function() {
      commentsLoadedStub = sinon.stub(CommentAction, '_commentsLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      commentsLoadedStub.restore();
    });

    it('calls API with trip and comment ID', function() {
      var testTripId = 'trip1';
      var testRefId = 'ref1';
      CommentAction.loadComments(testTripId, testRefId);
      expect(asyncStub.callCount).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.match(/^api\/getComment.php\?/);
      expect(asyncStub.args[0][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[0][0]).to.contain('referenceId=' + testRefId);
    });

    it('calls _commentsLoaded with right params', function() {
      var testTripId = 'trip1';
      var testRefId = 'ref1';
      CommentAction.loadComments(testTripId, testRefId);
      expect(commentsLoadedStub.callCount).to.be.equal(1);
      expect(commentsLoadedStub.args[0].length).to.be.equal(3);
      expect(commentsLoadedStub.args[0][0]).to.be.equal(testTripId);
      expect(commentsLoadedStub.args[0][1]).to.be.equal(testRefId);
      expect(commentsLoadedStub.args[0][2]).to.deep.eql(testData);
    });
  });

  describe('#_commentsLoaded', function() {
    var dispatchStub;
    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      var testTripId = 'trip1';
      var testRefId = 'ref1';
      var data = {
        count: 1,
        list: [
          {
            data: 'foo'
          }
        ]
      };
      CommentAction._commentsLoaded(testTripId, testRefId, data);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(CommentAction.Types.COMMENT_DATA);
      expect(action.data.tripId).to.be.equal(testTripId);
      expect(action.data.referenceId).to.be.equal(testRefId);
      expect(action.data.count).to.be.equal(data.count);
      expect(action.data.list).to.be.eql(data.list);
    });
  });

  describe('#recursivelyLoadComments', function() {
    var asyncStub;
    var recursivelyLoadedStub;
    var testData;
    var count;

    var testTripId = 'trip1';
    var testRefId = 'ref1';

    var testUserId1 = 'test-user-1';
    var testUserId2 = 'test-user-2';
    var testCommentId1 = 'test-comment-1';
    var testCommentId2 = 'test-comment-2';

    beforeEach(function() {
      recursivelyLoadedStub =
        sinon.stub(CommentAction, '_recursiveCommentsLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        if (this.count < 10) {
          this.count++;
          testData.commentId = 'comment-' + count;
        } else {
          delete testData.commentId;
        }
        callback(JSON.stringify(testData));
      });
      testData = {
        count: 2,
        list: [
          {
            userId: testUserId1,
            commentId: testCommentId1
          },
          {
            userId: testUserId2,
            commentId: testCommentId2
          }
        ]
      };
      count = 0;
      CommentAction.recursivelyLoadComments(testTripId, testRefId);
    });

    afterEach(function() {
      asyncStub.restore();
      recursivelyLoadedStub.restore();
    });

    it('calls API with the right parameters', function() {
      expect(asyncStub.callCount).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.match(/^api\/getComment.php\?/);
      expect(asyncStub.args[0][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[0][0]).to.contain('referenceId=' + testRefId);
    });

    it('calls _recursivelyCommentsLoaded with result value', function() {
      expect(recursivelyLoadedStub.callCount).to.be.equal(1);
      expect(recursivelyLoadedStub.args[0].length).to.be.equal(3);
      expect(recursivelyLoadedStub.args[0][0]).to.be.equal(testTripId);
      expect(recursivelyLoadedStub.args[0][1]).to.be.equal(testRefId);
      expect(recursivelyLoadedStub.args[0][2]).to.deep.eql(testData);
    });
  });

  describe('#_recursivelyCommentsLoaded', function() {
    describe('calls API', function() {
      var asyncStub;
      var dispatchStub;
      var testData;
      var count;
      var testTrip1 = 'test-trip-1';
      var testReference1 = 'test-reference-1';

      beforeEach(function() {
        asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
          if (count < 10) {
            count++;
            testData.count = 1;
            testData.list = [];
            testData.list[0] = {
              commentId: 'comment-' + count
            };
          } else {
            testData.count = 0;
          }
          callback(JSON.stringify(testData));
        });
        dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
        testData = {
          test1: 'data1'
        };
        count = 0;
      });

      afterEach(function() {
        dispatchStub.restore();
        asyncStub.restore();
      });

      it('with the right parameters', function() {
        CommentAction.recursivelyLoadComments(testTrip1, testReference1);

        expect(asyncStub.callCount).to.be.equal(11);
        expect(asyncStub.args[0].length).to.be.equal(2);
        expect(asyncStub.args[0][0]).to.match(/^api\/getComment.php\?/);
        expect(asyncStub.args[0][0]).to.contain('tripId=' + testTrip1);
        expect(asyncStub.args[0][0]).to.contain(
          'referenceId=' + testReference1);
        var j;
        for (j = 1; j <= 10; j++) {
          expect(asyncStub.args[j].length).to.be.equal(2);
          expect(asyncStub.args[j][0]).to.match(/^api\/getComment.php\?/,
                                               'URL for call ' + j);
          expect(asyncStub.args[j][0]).to.contain('tripId=' + testTrip1,
                                                 'tripId for call ' + j);
          expect(asyncStub.args[j][0]).to.contain(
            'referenceId=comment-' + j, 'expect comment-' + j);
        }
      });
    });

    describe('calls loadUserData', function() {
      var asyncStub;
      var dispatchStub;
      var testData;
      var testTrip1 = 'test-trip-1';
      var testReference1 = 'test-reference-1';

      var testUserId1 = 'test-user-1';
      var testUserId2 = 'test-user-2';
      var testCommentId1 = 'test-comment-1';
      var testCommentId2 = 'test-comment-2';

      beforeEach(function() {
        dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
        asyncStub = sinon.stub(utils, 'getAsync');
        testData = {
          count: 2,
          list: [
            {
              userId: testUserId1,
              commentId: testCommentId1
            },
            {
              userId: testUserId2,
              commentId: testCommentId2
            }
          ]
        };
        CommentAction._recursiveCommentsLoaded(testTrip1,
          testReference1, testData);
      });

      afterEach(function() {
        dispatchStub.restore();
        asyncStub.restore();
      });

      it('with the right parameters', function() {
        expect(loadUserStub.callCount).to.be.equal(2);
        expect(loadUserStub.args[0].length).to.be.equal(1);
        expect(loadUserStub.args[0][0]).to.be.equal(testUserId1);
        expect(loadUserStub.args[1].length).to.be.equal(1);
        expect(loadUserStub.args[1][0]).to.be.equal(testUserId2);
      });
    });
  });
});
