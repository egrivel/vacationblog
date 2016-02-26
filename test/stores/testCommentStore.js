'use strict';

var _ = require('lodash');
var expect = require('chai').expect;
var sinon = require('sinon');

var CommentActionTypes = require('../../src/actions/CommentAction').Types;
var CommentStore = require('../../src/stores/CommentStore');

var testTripId1 = '-test-trip-1';
var testReferenceId1 = '-test-reference-1';
var testReferenceId2 = '-test-reference-2';

var testCommentId1 = '-test-comment-1';
var testCommentId2 = '-test-comment-2';
var testCommentId3 = '-test-comment-3';
var testCommentId4 = '-test-comment-4';
var testCommentId5 = '-test-comment-5';
var testCommentId6 = '-test-comment-6';

var testComment1 = {
  tripId: testTripId1,
  commentId: testCommentId1,
  referenceId: testReferenceId1,
  commentText: 'comment text 1'
};

var testComment2 = {
  tripId: testTripId1,
  commentId: testCommentId2,
  referenceId: testReferenceId2,
  commentText: 'comment text 2'
};

var testComment3 = {
  tripId: testTripId1,
  commentId: testCommentId3,
  referenceId: testReferenceId1,
  commentText: 'comment text 3'
};

var testComment4 = {
  tripId: testTripId1,
  commentId: testCommentId4,
  referenceId: testCommentId1,
  commentText: 'comment text 4'
};

var testComment5 = {
  tripId: testTripId1,
  commentId: testCommentId5,
  referenceId: testCommentId1,
  commentText: 'comment text 5'
};

var testComment6 = {
  tripId: testTripId1,
  commentId: testCommentId6,
  referenceId: testCommentId5,
  commentText: 'comment text 6'
};

/**
 * Find the object with a specific property.
 * @param {object} obj - object to search.
 * @param {string} key - key to search for.
 * @param {string} value - value to search for.
 * @return {object} object found, or null if none was found.
 */
function findObjectWithProperty(obj, key, value) {
  console.log('finding ' + key + ' with value ' + value +
    ' in ' + JSON.stringify(obj));
  if (obj && obj[key] && obj[key] === value) {
    return obj;
  }

  _.forEach(obj, function(item) {
    if (typeof item === 'object') {
      if (findObjectWithProperty(item, key, value)) {
        return item;
      }
    }
  });
  return null;
}

describe('CommentStore', function() {
  beforeEach(function() {
    CommentStore.removeAllListeners();
    CommentStore._reset();
  });

  afterEach(function() {
    CommentStore.removeAllListeners();
  });

  // Behavior of an uninitialized trip store
  describe('without comments loaded', function() {
    describe('#getData', function() {
      it('returns undefined when uninitialized', function() {
        expect(CommentStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with comments loaded', function() {
    beforeEach(function() {
      CommentStore._storeCallback({
        type: CommentActionTypes.COMMENT_DATA,
        data: testComment1
      });
    });

    describe('#getData', function() {
      it('returns undefined without arguments', function() {
        expect(CommentStore.getData()).to.deep.eql(undefined);
      });

      it('returns undefined with invalid arguments', function() {
        expect(CommentStore.getData(testTripId1)).to.deep.eql(undefined);
        expect(CommentStore.getData(testTripId1, null))
          .to.deep.eql(undefined);
        expect(CommentStore.getData(null, testReferenceId1))
          .to.deep.eql(undefined);
      });

      it('returns undefined requesting non-loaded data', function() {
        expect(CommentStore.getData(testTripId1, testReferenceId2))
          .to.deep.eql(undefined);
      });

      it('returns loaded comment', function() {
        expect(CommentStore.getData(testTripId1, testReferenceId1))
          .to.deep.eql([testComment1]);
      });

      it('new comment is available after it was loaded', function() {
        // comment 2 is not yet there
        expect(CommentStore.getData(testTripId1, testReferenceId2))
          .to.deep.eql(undefined);

        // action to load comment 2
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment2
        });

        // comment 2 is now there
        expect(CommentStore.getData(testTripId1, testReferenceId2))
          .to.deep.eql([testComment2]);
      });
    });

    describe('#getRecursiveData', function() {
      beforeEach(function() {
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment1
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment2
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment3
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment4
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment5
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment6
        });
      });

      it('get recursive structure', function() {
        var result =
          CommentStore.getRecursiveData(testTripId1, testReferenceId1);
        expect(result).to.exist;
        var obj =
          findObjectWithProperty(result, 'commentText', 'comment text 1');
        expect(obj).to.not.be.null;
      });
    });

    describe('#emitChange', function() {
      it('setting existing comment does not emit change', function() {
        var cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment1
        });
        expect(cb.callCount).to.be.equal(0);
      });

      it('setting comment with new text does emit change', function() {
        var cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        testComment1.commentText = 'some other text';
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment1
        });
        expect(cb.callCount).to.be.equal(1);
      });

      it('setting new comment does emit change', function() {
        var cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment2
        });
        expect(cb.callCount).to.be.equal(1);
      });

      it('unknown action does not emit change', function() {
        var cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: 'foo',
          data: testComment2
        });
        expect(cb.callCount).to.be.equal(0);
      });
    });
  });
});
