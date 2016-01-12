'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var AppDispatcher = require('../../src/AppDispatcher');
var CommentAction = require('../../src/actions/CommentAction');

describe('CommentAction stuff', function() {
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
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.match(/^api\/getComment.php\?/);
      expect(asyncStub.args[0][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[0][0]).to.contain('referenceId=' + testRefId);
    });

    it('calls _commentsLoaded with right params', function() {
      var testTripId = 'trip1';
      var testRefId = 'ref1';
      CommentAction.loadComments(testTripId, testRefId);
      expect(commentsLoadedStub.args[0].length).to.be.equal(3);
      expect(commentsLoadedStub.args[0][0]).to.be.equal(testTripId);
      expect(commentsLoadedStub.args[0][1]).to.be.equal(testRefId);
      expect(commentsLoadedStub.args[0][2]).to.be.eql(testData);
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
});
