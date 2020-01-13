
const expect = require('chai').expect;
import sinon from 'sinon';

import MediaActionTypes from '../../src/actions/MediaActionTypes';
import MediaStore from '../../src/stores/MediaStore';

const testTripId1 = '-test-trip-1';
const testMediaId1 = '-test-media-1';
const testMediaId2 = '-test-media-2';

const testMedia1 = {
  tripId: testTripId1,
  mediaId: testMediaId1,
  mediaText: 'media text 1'
};

const testMedia2 = {
  tripId: testTripId1,
  mediaId: testMediaId2,
  mediaText: 'media text 2'
};

describe('stores/MediaStore', () => {
  // Always have the media store available
  beforeEach(() => {
    MediaStore.removeAllListeners();
    MediaStore._reset();
  });

  // Behavior of an uninitialized media store
  describe('without medias loaded', () => {
    describe('#getData', () => {
      it('returns undefined when uninitialized', () => {
        expect(MediaStore.getData()).to.equal(undefined);
      });
    });
  });

  describe('with media loaded', () => {
    beforeEach(() => {
      MediaStore._storeCallback({
        type: MediaActionTypes.MEDIA_DATA,
        data: testMedia1
      });
    });

    describe('#getData', () => {
      it('returns undefined without arguments', () => {
        expect(MediaStore.getData()).to.deep.eql(undefined);
      });

      it('returns undefined with invalid arguments', () => {
        expect(MediaStore.getData(testTripId1)).to.deep.eql(undefined);
        expect(MediaStore.getData(testTripId1, null))
          .to.deep.eql(undefined);
        expect(MediaStore.getData(null, testMediaId1))
          .to.deep.eql(undefined);
      });

      it('returns undefined requesting non-loaded data', () => {
        expect(MediaStore.getData(testTripId1, testMediaId2))
          .to.deep.eql(undefined);
      });

      it('returns loaded media', () => {
        expect(MediaStore.getData(testTripId1, testMediaId1))
          .to.deep.eql(testMedia1);
      });

      it('new media is available after it was loaded', () => {
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

      describe('checking change emitter', () => {
        let cb;

        beforeEach(() => {
          cb = sinon.spy();
          MediaStore.addChangeListener(cb);
        });

        afterEach(() => {
          MediaStore.removeChangeListener(cb);
        });

        it('setting existing media does not emit change', () => {
          MediaStore._storeCallback({
            type: MediaActionTypes.MEDIA_DATA,
            data: testMedia1
          });
          expect(cb.callCount).to.be.equal(0);
        });

        it('setting new media does emit change', () => {
          MediaStore._storeCallback({
            type: MediaActionTypes.MEDIA_DATA,
            data: testMedia2
          });
          expect(cb.callCount).to.be.equal(1);
        });

        it('random action does notemit change', () => {
          MediaStore._storeCallback({
            type: 'foo',
            data: testMedia2
          });
          expect(cb.callCount).to.be.equal(0);
        });
      });
    });
  });

  describe('Loading media in bulk', () => {
    const mediaItem1 = {
      tripId: testTripId1,
      mediaId: testMediaId1,
      title: 'title 1'
    };

    const mediaItem2 = {
      tripId: testTripId1,
      mediaId: testMediaId2,
      title: 'title 2'
    };

    const bulkAction = {
      type: MediaActionTypes.MEDIA_BULK_DATA,
      data: {
        count: 2,
        list: [
          mediaItem1,
          mediaItem2
        ]
      }
    };

    it('data is set', () => {
      MediaStore._storeCallback(bulkAction);

      expect(MediaStore.getData(testTripId1, testMediaId1))
        .to.deep.eql(mediaItem1);
      expect(MediaStore.getData(testTripId1, testMediaId2))
        .to.deep.eql(mediaItem2);
    });

    describe('checking change emitter', () => {
      let cb;

      beforeEach(() => {
        cb = sinon.spy();
        MediaStore.addChangeListener(cb);
      });

      afterEach(() => {
        MediaStore.removeChangeListener(cb);
      });

      it('change emitter is called', () => {
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
