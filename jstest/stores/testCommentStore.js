'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var rewire = require('rewire');

var CommentActionTypes = require('../../src/actions/CommentAction').Types;

var testTripId1 = '-test-trip-1';
var testReferenceId1 = '-test-reference-1';
var testReferenceId2 = '-test-reference-2';

var testComment1 = {
  tripId: testTripId1,
  referenceId: testReferenceId1,
  commentText: 'comment text 1'
};

var testComment2 = {
  tripId: testTripId1,
  referenceId: testReferenceId2,
  commentText: 'comment text 2'
};

describe('CommentStore', function() {
  // Always have the comment store available
  beforeEach(function() {
    this.CommentStore = rewire('../../src/stores/CommentStore');
    this.storeCallback = this.CommentStore.__get__('storeCallback');
  });

  // Behavior of an uninitialized trip store
  describe('without comments loaded', function() {
    describe('#getData', function() {
      it('returns undefined when uninitialized', function() {
        expect(this.CommentStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with comments loaded', function() {
    beforeEach(function() {
      this.storeCallback({
        type: CommentActionTypes.COMMENT_DATA,
        data: testComment1
      });
    });

    describe('#getData', function() {
      it('returns undefined without arguments', function() {
        expect(this.CommentStore.getData()).to.deep.eql(undefined);
      });

      it('returns undefined with invalid arguments', function() {
        expect(this.CommentStore.getData(testTripId1)).to.deep.eql(undefined);
        expect(this.CommentStore.getData(testTripId1, null))
          .to.deep.eql(undefined);
        expect(this.CommentStore.getData(null, testReferenceId1))
          .to.deep.eql(undefined);
      });

      it('returns undefined requesting non-loaded data', function() {
        expect(this.CommentStore.getData(testTripId1, testReferenceId2))
          .to.deep.eql(undefined);
      });

      it('returns loaded comment', function() {
        expect(this.CommentStore.getData(testTripId1, testReferenceId1))
          .to.deep.eql(testComment1);
      });

      it('new comment is available after it was loaded', function() {
        // comment 2 is not yet there
        expect(this.CommentStore.getData(testTripId1, testReferenceId2))
          .to.deep.eql(undefined);

        // action to load comment 2
        this.storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment2
        });

        // comment 2 is now there
        expect(this.CommentStore.getData(testTripId1, testReferenceId2))
          .to.deep.eql(testComment2);
      });

      it('setting existing comment does not emit change', function() {
        var cb = sinon.spy();
        this.CommentStore.addChangeListener(cb);

        this.storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment1
        });
        expect(cb.callCount).to.be.equal(0);

        this.CommentStore.removeChangeListener(cb);
      });

      it('setting new comment does emit change', function() {
        var cb = sinon.spy();
        this.CommentStore.addChangeListener(cb);

        this.storeCallback({
          type: CommentActionTypes.COMMENT_DATA,
          data: testComment2
        });
        expect(cb.callCount).to.be.equal(1);

        this.CommentStore.removeChangeListener(cb);
      });

      it('unknown action does not emit change', function() {
        var cb = sinon.spy();
        this.CommentStore.addChangeListener(cb);

        this.storeCallback({
          type: 'foo',
          data: testComment2
        });
        expect(cb.callCount).to.be.equal(0);

        this.CommentStore.removeChangeListener(cb);
      });
    });
  });
});
