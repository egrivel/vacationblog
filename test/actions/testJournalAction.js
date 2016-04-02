'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var utils = require('../../src/actions/utils');
var AppDispatcher = require('../../src/AppDispatcher');
var JournalAction = require('../../src/actions/JournalAction');
var CommentAction = require('../../src/actions/CommentAction');
var MediaAction = require('../../src/actions/MediaAction');
var UserAction = require('../../src/actions/UserAction');

describe('JournalAction stuff', function() {
  var loadUserStub;

  beforeEach(function() {
    loadUserStub = sinon.stub(UserAction, 'loadUser');
  });

  afterEach(function() {
    loadUserStub.restore();
  });

  describe('#loadJournal', function() {
    var asyncStub;
    var journalLoadedStub;
    var testData = {
      test1: 'data1'
    };

    beforeEach(function() {
      journalLoadedStub = sinon.stub(JournalAction, '_journalLoaded');
      asyncStub = sinon.stub(utils, 'getAsync', function(url, callback) {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(function() {
      asyncStub.restore();
      journalLoadedStub.restore();
    });

    it('calls API with trip and journal ID', function() {
      var testTripId = 'trip1';
      var testJournalId = 'ref1';
      JournalAction.loadJournal(testTripId, testJournalId);
      // This results in two calls, one to read the trip data, the other
      // to read the journal
      expect(asyncStub.args.length).to.be.equal(2);
      expect(asyncStub.args[1].length).to.be.equal(2);
      expect(asyncStub.args[1][0]).to.match(/^api\/getJournal.php\?/);
      expect(asyncStub.args[1][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[1][0]).to.contain('journalId=' + testJournalId);
    });

    it('calls API with trip ID and latest when no journal ID', function() {
      var testTripId = 'trip1';
      JournalAction.loadJournal(testTripId);
      // This results in two calls, one to read the trip data, the other
      // to read the journal
      expect(asyncStub.args.length).to.be.equal(2);
      expect(asyncStub.args[1].length).to.be.equal(2);
      expect(asyncStub.args[1][0]).to.match(/^api\/getJournal.php\?/);
      expect(asyncStub.args[1][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[1][0]).to.contain('latest');
    });

    it('calls _journalLoaded with right params', function() {
      var testTripId = 'trip1';
      var testJournalId = 'journal1';
      JournalAction.loadJournal(testTripId, testJournalId);
      expect(journalLoadedStub.args[0].length).to.be.equal(1);
      expect(journalLoadedStub.args[0][0]).to.be.eql(testData);
    });
  });

  describe('#_journalLoaded', function() {
    var dispatchStub;
    var commentLoadStub;
    var getMediaFromTextStub;
    var mediaLoadStub;

    var testTripId1 = 'test-trip-1';
    var testJournalId1 = 'test-journal-1';
    var testJournalText1 = 'test of the journal text';
    var testMediaList = null;

    beforeEach(function() {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
      commentLoadStub = sinon.stub(CommentAction, 'recursivelyLoadComments');
      getMediaFromTextStub = sinon.stub(JournalAction, '_getMediaFromText',
        function() {
          return testMediaList;
        });
      mediaLoadStub = sinon.stub(MediaAction, 'loadMedia');
    });

    afterEach(function() {
      mediaLoadStub.restore();
      getMediaFromTextStub.restore();
      commentLoadStub.restore();
      dispatchStub.restore();
    });

    it('dispatch is called with right info', function() {
      var data = {
        tripId: testTripId1,
        journalId: testJournalId1,
        journalText: testJournalText1
      };
      JournalAction._journalLoaded(data);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      var action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(JournalAction.Types.JOURNAL_DATA);
      expect(action.data).to.be.deep.eql(data);
    });

    describe('recursivelyLoadComments', function() {
      it('is called with right info', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(commentLoadStub.callCount).to.be.equal(1);
        expect(commentLoadStub.args[0].length).to.be.equal(2);
        expect(commentLoadStub.args[0][0]).to.be.equal(testTripId1);
        expect(commentLoadStub.args[0][1]).to.be.equal(testJournalId1);
      });

      it('is not called without trip ID', function() {
        var data = {
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(commentLoadStub.callCount).to.be.equal(0);
      });

      it('is not called without journal ID', function() {
        var data = {
          tripId: testTripId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(commentLoadStub.callCount).to.be.equal(0);
      });
    });

    describe('loadUser', function() {
      it('is called with the right info', function() {
        var testUser1 = 'test-user-1';
        var data = {
          userId: testUser1,
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(loadUserStub.callCount).to.be.equal(1);
        expect(loadUserStub.args[0].length).to.be.equal(1);
        expect(loadUserStub.args[0][0]).to.be.equal(testUser1);
      });

      it('is not called without user ID', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(loadUserStub.callCount).to.be.equal(0);
      });
    });

    describe('getMediaFromText', function() {
      it('is called with the right parameters', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(1);
        expect(getMediaFromTextStub.args[0].length).to.be.equal(1);
        expect(getMediaFromTextStub.args[0][0]).to.be.equal(testJournalText1);
      });

      it('is not called without a trip ID', function() {
        var data = {
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(0);
      });

      it('is not called without a journal ID', function() {
        var data = {
          tripId: testTripId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(0);
      });

      it('is not called without a trip text', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(0);
      });
    });

    describe('loadMedia', function() {
      beforeEach(function() {
        testMediaList = ['image-1', 'image-2', 'image-3'];
      });

      it('is called with right info', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(3);
        expect(mediaLoadStub.args[0].length).to.be.equal(2);
        expect(mediaLoadStub.args[0][0]).to.be.equal(testTripId1);
        expect(mediaLoadStub.args[0][1]).to.be.equal(testMediaList[0]);
        expect(mediaLoadStub.args[1].length).to.be.equal(2);
        expect(mediaLoadStub.args[1][0]).to.be.equal(testTripId1);
        expect(mediaLoadStub.args[1][1]).to.be.equal(testMediaList[1]);
        expect(mediaLoadStub.args[2].length).to.be.equal(2);
        expect(mediaLoadStub.args[2][0]).to.be.equal(testTripId1);
        expect(mediaLoadStub.args[2][1]).to.be.equal(testMediaList[2]);
      });

      it('is not called without a trip ID', function() {
        var data = {
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(0);
      });

      it('is not called without a journal ID', function() {
        var data = {
          tripId: testTripId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(0);
      });

      it('is not called without a trip text', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(0);
      });
    });

    describe('recursivelyLoadComments for media', function() {
      beforeEach(function() {
        testMediaList = ['image-1', 'image-2', 'image-3'];
      });

      it('is called with right info', function() {
        var data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(commentLoadStub.callCount).to.be.equal(4);
        expect(commentLoadStub.args[0].length).to.be.equal(2);
        expect(commentLoadStub.args[0][0]).to.be.equal(testTripId1);
        expect(commentLoadStub.args[0][1]).to.be.equal(testJournalId1);
        expect(commentLoadStub.args[1].length).to.be.equal(2);
        expect(commentLoadStub.args[1][0]).to.be.equal(testTripId1);
        expect(commentLoadStub.args[1][1]).to.be.equal(testMediaList[0]);
        expect(commentLoadStub.args[2].length).to.be.equal(2);
        expect(commentLoadStub.args[2][0]).to.be.equal(testTripId1);
        expect(commentLoadStub.args[2][1]).to.be.equal(testMediaList[1]);
        expect(commentLoadStub.args[3].length).to.be.equal(2);
        expect(commentLoadStub.args[3][0]).to.be.equal(testTripId1);
        expect(commentLoadStub.args[3][1]).to.be.equal(testMediaList[2]);
      });
    });
  });

  describe('#getMediaFromText', function() {
    var testImage1 = '111-222';
    var testImage2 = '3333-4444';
    var testText1 = 'This is a text without any images';
    var testText2 = 'test with [' + testImage1 + '] invalid image';

    it('returns null without text', function() {
      var result = JournalAction._getMediaFromText();
      expect(result).to.be.null;
    });

    it('returns empty array for text without images', function() {
      var result = JournalAction._getMediaFromText(testText1);
      expect(result).to.deep.eql([]);
    });

    it('does not return invalid image', function() {
      var result = JournalAction._getMediaFromText(testText2);
      expect(result).to.deep.eql([]);
    });

    describe('single image', function() {
      var testText3 = '[IMG ' + testImage1 + '] test with starting image';
      var testText4 = 'Test with ending image [IMG ' + testImage1 + ']';
      var testText5 = 'Test with [IMG ' + testImage1 + '] middle image';
      var testText6 = 'test with [IMG   ' + testImage1 + '  ] extra space';

      it('returns single image from text, at start', function() {
        var result = JournalAction._getMediaFromText(testText3);
        expect(result).to.deep.eql([testImage1]);
      });

      it('returns single image from text, at end', function() {
        var result = JournalAction._getMediaFromText(testText4);
        expect(result).to.deep.eql([testImage1]);
      });

      it('returns single image from text, in middle', function() {
        var result = JournalAction._getMediaFromText(testText5);
        expect(result).to.deep.eql([testImage1]);
      });

      it('returns single image with extra space', function() {
        var result = JournalAction._getMediaFromText(testText6);
        expect(result).to.deep.eql([testImage1]);
      });
    });

    describe('returns multiple images from text', function() {
      var testText7 = '[IMG ' + testImage1 + '][IMG ' + testImage2 + ']';
      var testText8 = '[IMG ' + testImage1 +
        '] and some text [IMG ' + testImage2 + ']';
      var testText9 = 'initial text [IMG ' +
        testImage1 + '][IMG ' + testImage2 + ']';
      var testText10 = '[IMG ' + testImage1 +
        '][IMG ' + testImage2 + '] final text';
      var testText11 = 'this [IMG ' + testImage1 +
        '] is [IMG ' + testImage2 + '] stuff';

      it('only images', function() {
        var result = JournalAction._getMediaFromText(testText7);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text in the middle', function() {
        var result = JournalAction._getMediaFromText(testText8);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text at the front', function() {
        var result = JournalAction._getMediaFromText(testText9);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text at the end', function() {
        var result = JournalAction._getMediaFromText(testText10);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text everywhere', function() {
        var result = JournalAction._getMediaFromText(testText11);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });
    });
  });
});
