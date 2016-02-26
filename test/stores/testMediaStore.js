'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var MediaActionTypes = require('../../src/actions/MediaAction').Types;
var MediaStore = require('../../src/stores/MediaStore');

var testTripId1 = '-test-trip-1';
var testMediaId1 = '-test-media-1';
var testMediaId2 = '-test-media-2';

var testMedia1 = {
  tripId: testTripId1,
  mediaId: testMediaId1,
  mediaText: 'media text 1'
};

var testMedia2 = {
  tripId: testTripId1,
  mediaId: testMediaId2,
  mediaText: 'media text 2'
};

describe('MediaStore', function() {
  // Always have the media store available
  beforeEach(function() {
    MediaStore.removeAllListeners();
    MediaStore._reset();
  });

  // Behavior of an uninitialized media store
  describe('without medias loaded', function() {
    describe('#getData', function() {
      it('returns undefined when uninitialized', function() {
        expect(MediaStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with media loaded', function() {
    beforeEach(function() {
      MediaStore._storeCallback({
        type: MediaActionTypes.MEDIA_DATA,
        data: testMedia1
      });
    });

    describe('#getData', function() {
      it('returns undefined without arguments', function() {
        expect(MediaStore.getData()).to.deep.eql(undefined);
      });

      it('returns undefined with invalid arguments', function() {
        expect(MediaStore.getData(testTripId1)).to.deep.eql(undefined);
        expect(MediaStore.getData(testTripId1, null))
          .to.deep.eql(undefined);
        expect(MediaStore.getData(null, testMediaId1))
          .to.deep.eql(undefined);
      });

      it('returns undefined requesting non-loaded data', function() {
        expect(MediaStore.getData(testTripId1, testMediaId2))
          .to.deep.eql(undefined);
      });

      it('returns loaded media', function() {
        expect(MediaStore.getData(testTripId1, testMediaId1))
          .to.deep.eql(testMedia1);
      });

      it('new media is available after it was loaded', function() {
        // media 2 is not yet there
        expect(MediaStore.getData(testTripId1, testMediaId2))
          .to.deep.eql(undefined);

        // action to load media 2
        MediaStore._storeCallback({
          type: MediaActionTypes.MEDIA_DATA,
          data: testMedia2
        });

        // media 2 is now there
        expect(MediaStore.getData(testTripId1, testMediaId2))
          .to.deep.eql(testMedia2);
      });

      describe('checking change emitter', function() {
        var cb;

        beforeEach(function() {
          cb = sinon.spy();
          MediaStore.addChangeListener(cb);
        });

        afterEach(function() {
          MediaStore.removeChangeListener(cb);
        });

        it('setting existing media does not emit change', function() {
          MediaStore._storeCallback({
            type: MediaActionTypes.MEDIA_DATA,
            data: testMedia1
          });
          expect(cb.callCount).to.be.equal(0);
        });

        it('setting new media does emit change', function() {
          MediaStore._storeCallback({
            type: MediaActionTypes.MEDIA_DATA,
            data: testMedia2
          });
          expect(cb.callCount).to.be.equal(1);
        });

        it('random action does notemit change', function() {
          MediaStore._storeCallback({
            type: 'foo',
            data: testMedia2
          });
          expect(cb.callCount).to.be.equal(0);
        });
      });
    });
  });

  describe('Loading media in bulk', function() {
    var mediaItem1 = {
      tripId: testTripId1,
      mediaId: testMediaId1,
      title: 'title 1'
    };

    var mediaItem2 = {
      tripId: testTripId1,
      mediaId: testMediaId2,
      title: 'title 2'
    };

    var bulkAction = {
      type: MediaActionTypes.MEDIA_BULK_DATA,
      data: {
        count: 2,
        list: [
          mediaItem1,
          mediaItem2
        ]
      }
    };

    it('data is set', function() {
      MediaStore._storeCallback(bulkAction);

      expect(MediaStore.getData(testTripId1, testMediaId1))
        .to.deep.eql(mediaItem1);
      expect(MediaStore.getData(testTripId1, testMediaId2))
        .to.deep.eql(mediaItem2);
    });

    describe('checking change emitter', function() {
      var cb;

      beforeEach(function() {
        cb = sinon.spy();
        MediaStore.addChangeListener(cb);
      });

      afterEach(function() {
        MediaStore.removeChangeListener(cb);
      });

      it('change emitter is called', function() {
        // first call emits change
        expect(cb.callCount).to.be.equal(0);
        MediaStore._storeCallback(bulkAction);
        expect(cb.callCount).to.be.equal(1);

        // second call does not emit change
        MediaStore._storeCallback(bulkAction);
        expect(cb.callCount).to.be.equal(1);
      });
    });
  });
});
