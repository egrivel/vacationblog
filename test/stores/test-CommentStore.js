'use strict';

import _ from 'lodash';
const expect = require('chai').expect;
import sinon from 'sinon';

const CommentActionTypes = require('../../src/actions/CommentAction').Types;
import CommentStore from '../../src/stores/CommentStore';

const testTripId1 = '-test-trip-1';
const testReferenceId1 = '-test-reference-1';
const testReferenceId2 = '-test-reference-2';

const testCommentId1 = '-test-comment-1';
const testCommentId2 = '-test-comment-2';
const testCommentId3 = '-test-comment-3';
const testCommentId4 = '-test-comment-4';
const testCommentId5 = '-test-comment-5';
const testCommentId6 = '-test-comment-6';

const testComment1 = {
  tripId: testTripId1,
  commentId: testCommentId1,
  referenceId: testReferenceId1,
  commentText: 'comment text 1'
};

const testComment2 = {
  tripId: testTripId1,
  commentId: testCommentId2,
  referenceId: testReferenceId2,
  commentText: 'comment text 2'
};

const testComment3 = {
  tripId: testTripId1,
  commentId: testCommentId3,
  referenceId: testReferenceId1,
  commentText: 'comment text 3'
};

const testComment4 = {
  tripId: testTripId1,
  commentId: testCommentId4,
  referenceId: testCommentId1,
  commentText: 'comment text 4'
};

const testComment5 = {
  tripId: testTripId1,
  commentId: testCommentId5,
  referenceId: testCommentId1,
  commentText: 'comment text 5'
};

const testComment6 = {
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
  if (obj && obj[key] && obj[key] === value) {
    return obj;
  }

  let returnValue = null;
  _.forEach(obj, function(item) {
    if (typeof item === 'object') {
      if (findObjectWithProperty(item, key, value)) {
        returnValue = item;
      }
    }
  });

  return returnValue;
}

describe('stores/CommentStore', function() {
  beforeEach(function() {
    CommentStore.removeAllListeners();
    CommentStore._reset();
  });

  afterEach(function() {
    CommentStore.removeAllListeners();
  });

  // Behavior of an uninitialized trip store
  describe('without comments loaded', function() {
    describe('#getList', function() {
      it('returns empty list when uninitialized', function() {
        expect(CommentStore.getList(testTripId1, testReferenceId1))
          .to.deep.eql([]);
      });
    });
  });

  describe('with comments loaded', function() {
    beforeEach(function() {
      CommentStore._storeCallback({
        type: CommentActionTypes.COMMENT_DATA,
        data: {
          list: [testComment1]
        }
      });
    });

    describe('#getList', function() {
      it('returns undefined without arguments', function() {
        expect(CommentStore.getList()).to.deep.eql(undefined);
      });

      it('returns undefined with invalid arguments', function() {
        expect(CommentStore.getList(testTripId1)).to.deep.eql(undefined);
        expect(CommentStore.getList(testTripId1, null))
          .to.deep.eql(undefined);
        expect(CommentStore.getList(null, testReferenceId1))
          .to.deep.eql(undefined);
      });

      it('returns empty list requesting non-loaded data', function() {
        expect(CommentStore.getList(testTripId1, testReferenceId2))
          .to.deep.eql([]);
      });

      it('returns loaded comment', function() {
        expect(CommentStore.getList(testTripId1, testReferenceId1))
          .to.deep.eql([testComment1]);
      });

      it('new comment is available after it was loaded', function() {
        // comment 2 is not yet there
        expect(CommentStore.getList(testTripId1, testReferenceId2))
          .to.deep.eql([]);

        // action to load comment 2
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment2]
          }
        });

        // comment 2 is now there
        expect(CommentStore.getList(testTripId1, testReferenceId2))
          .to.deep.eql([testComment2]);
      });
    });

    describe('#getRecursiveList', function() {
      beforeEach(function() {
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment1]
          }
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment2]
          }
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment3]
          }
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment4]
          }
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment5]
          }
        });
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment6]
          }
        });
      });

      describe('using reference id 1', function() {
        let result;
        beforeEach(function() {
          result =
            CommentStore.getRecursiveList(testTripId1, testReferenceId1);
        });

        it('should get comment 1', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment1.commentText);
          expect(obj).to.not.be.null;
        });

        it('should not get comment 2', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment2.commentText);
          expect(obj).to.be.null;
        });

        it('should get comment 3', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment3.commentText);
          expect(obj).to.not.be.null;
        });

        it('should get comment 4', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment4.commentText);
          expect(obj).to.not.be.null;
        });

        it('should get comment 5', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment5.commentText);
          expect(obj).to.not.be.null;
        });

        it('should get comment 6', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment6.commentText);
          expect(obj).to.not.be.null;
        });
      });

      describe('using reference id 2', function() {
        let result;
        beforeEach(function() {
          result =
            CommentStore.getRecursiveList(testTripId1, testReferenceId2);
        });

        it('should not get comment 1', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment1.commentText);
          expect(obj).to.be.null;
        });

        it('should get comment 2', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment2.commentText);
          expect(obj).to.not.be.null;
        });

        it('should not get comment 3', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment3.commentText);
          expect(obj).to.be.null;
        });

        it('should not get comment 4', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment4.commentText);
          expect(obj).to.be.null;
        });

        it('should not get comment 5', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment5.commentText);
          expect(obj).to.be.null;
        });

        it('should not get comment 6', function() {
          expect(result).to.exist;
          const obj =
            findObjectWithProperty(result, 'commentText',
              testComment6.commentText);
          expect(obj).to.be.null;
        });
      });
    });

    describe('#emitChange', function() {
      it('setting without data does not emit change', function() {
        const cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA
        });
        expect(cb.callCount).to.be.equal(0);
      });

      it('setting existing comment does not emit change', function() {
        const cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment1]
          }
        });
        expect(cb.callCount).to.be.equal(0);
      });

      it('setting comment with new text does emit change', function() {
        const cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        testComment1.commentText = 'some other text';
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment1]
          }
        });
        expect(cb.callCount).to.be.equal(1);
      });

      it('setting new comment does emit change', function() {
        const cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: {
            list: [testComment2]
          }
        });
        expect(cb.callCount).to.be.equal(1);
      });

      it('unknown action does not emit change', function() {
        const cb = sinon.spy();
        CommentStore.addChangeListener(cb);

        expect(cb.callCount).to.be.equal(0);
        CommentStore._storeCallback({
          type: 'foo',
          data: {
            list: [testComment2]
          }
        });
        expect(cb.callCount).to.be.equal(0);
      });
    });
  });
});
