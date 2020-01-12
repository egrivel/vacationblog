'use strict';

const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import AppDispatcher from '../../src/AppDispatcher';
import MediaAction from '../../src/actions/MediaAction';

describe('actions/MediaAction', function() {
  describe('#loadMedia', function() {
    let asyncStub;
    let mediaLoadedStub;
    const testData = {
      data: 'data'
    };

    beforeEach(function() {
      mediaLoadedStub = sinon.stub(MediaAction, '_mediaLoaded');
      asyncStub = sinon.stub(utils, 'getAsync').callsFake(function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      mediaLoadedStub.restore();
    });

    it('calls API with trip and media ID', function() {
      const testTripId = 'trip1';
      const testMediaId = 'media1';

      MediaAction.loadMedia(testTripId, testMediaId);
      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.match(/^api\/getMedia.php\?/);
      expect(asyncStub.args[0][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[0][0]).to.contain('mediaId=' + testMediaId);
    });

    it('calls _mediaLoaded with the right parameters', function() {
      const testTripId = 'trip1';
      const testMediaId = 'media1';

      MediaAction.loadMedia(testTripId, testMediaId);
      expect(mediaLoadedStub.args[0].length).to.be.equal(1);
      expect(mediaLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#bulkLoadMedia', function() {
    let asyncStub;
    let bulkMediaLoadedStub;
    const testData = {
      data: 'data'
    };

    beforeEach(function() {
      bulkMediaLoadedStub = sinon.stub(MediaAction, '_bulkMediaLoaded');
      asyncStub = sinon.stub(utils, 'getAsync').callsFake(function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      bulkMediaLoadedStub.restore();
    });

    it('calls API with trip and list', function() {
      const testTripId = 'trip1';
      const testMedia1 = 'media1';
      const testMedia2 = 'media2';
      const testMedia3 = 'media3';
      const testMediaList = [
        testMedia1,
        testMedia2,
        testMedia3
      ];

      MediaAction.bulkLoadMedia(testTripId, testMediaList);
      expect(asyncStub.args.length).to.be.equal(1);
      expect(asyncStub.args[0].length).to.be.equal(2);
      expect(asyncStub.args[0][0]).to.match(/^api\/getMedia.php\?/);
      expect(asyncStub.args[0][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[0][0]).to.contain('list=');
      expect(asyncStub.args[0][0]).to.contain(testMedia1);
      expect(asyncStub.args[0][0]).to.contain(testMedia2);
      expect(asyncStub.args[0][0]).to.contain(testMedia3);
    });

    it('calls _mediaLoaded with the right parameters', function() {
      const testTripId = 'trip1';
      const testMedia1 = 'media1';
      const testMedia2 = 'media2';
      const testMedia3 = 'media3';
      const testMediaList = [
        testMedia1,
        testMedia2,
        testMedia3
      ];

      MediaAction.bulkLoadMedia(testTripId, testMediaList);
      expect(bulkMediaLoadedStub.args[0].length).to.be.equal(1);
      expect(bulkMediaLoadedStub.args[0][0]).to.be.deep.eql(testData);
    });
  });

  describe('#_bulkMediaLoaded', function() {
    let dispatchStub;
    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with the right info', function() {
      const data = {
        test1: 'data1',
        test2: 'data2'
      };

      MediaAction._mediaLoaded(data);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MediaAction.Types.MEDIA_DATA);
      expect(action.data).to.be.deep.eql(data);
    });
  });

  describe('#_mediaLoaded', function() {
    let dispatchStub;
    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
    });

    afterEach(function() {
      dispatchStub.restore();
    });

    it('dispatch is called with the right info', function() {
      const data = {
        test1: 'data1',
        test2: 'data2'
      };

      MediaAction._bulkMediaLoaded(data);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(MediaAction.Types.MEDIA_BULK_DATA);
      expect(action.data).to.be.deep.eql(data);
    });
  });
});
