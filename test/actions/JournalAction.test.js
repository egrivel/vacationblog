
const expect = require('chai').expect;
import sinon from 'sinon';

import utils from '../../src/actions/utils';
import AppDispatcher from '../../src/AppDispatcher';
import JournalAction from '../../src/actions/JournalAction';
import JournalActionTypes from '../../src/actions/JournalActionTypes';
import CommentAction from '../../src/actions/CommentAction';
import MediaAction from '../../src/actions/MediaAction';
import UserAction from '../../src/actions/UserAction';

describe('actions/JournalAction', () => {
  let loadUserStub;

  beforeEach(() => {
    loadUserStub = sinon.stub(UserAction, 'loadUser');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#loadJournal', () => {
    let asyncStub;
    let journalLoadedStub;
    const testData = {
      test1: 'data1'
    };

    beforeEach(() => {
      journalLoadedStub = sinon.stub(JournalAction, '_journalLoaded');
      asyncStub = sinon.stub(utils, 'getAsync').callsFake((url, callback) => {
        callback(JSON.stringify(testData));
      });
    });

    afterEach(() => {
      asyncStub.restore();
      journalLoadedStub.restore();
    });

    it('calls API with trip and journal ID', () => {
      const testTripId = 'trip1';
      const testJournalId = 'ref1';
      JournalAction.loadJournal(testTripId, testJournalId);
      // This results in two calls, one to read the trip data, the other
      // to read the journal
      expect(asyncStub.args.length).to.be.equal(2);
      expect(asyncStub.args[1].length).to.be.equal(2);
      expect(asyncStub.args[1][0]).to.match(/^api\/getJournal.php\?/);
      expect(asyncStub.args[1][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[1][0]).to.contain('journalId=' + testJournalId);
    });

    it('calls API with trip ID and latest when no journal ID', () => {
      const testTripId = 'trip1';
      JournalAction.loadJournal(testTripId);
      // This results in two calls, one to read the trip data, the other
      // to read the journal
      expect(asyncStub.args.length).to.be.equal(2);
      expect(asyncStub.args[1].length).to.be.equal(2);
      expect(asyncStub.args[1][0]).to.match(/^api\/getJournal.php\?/);
      expect(asyncStub.args[1][0]).to.contain('tripId=' + testTripId);
      expect(asyncStub.args[1][0]).to.contain('latest');
    });

    it('calls _journalLoaded with right params', () => {
      const testTripId = 'trip1';
      const testJournalId = 'journal1';
      JournalAction.loadJournal(testTripId, testJournalId);
      expect(journalLoadedStub.args[0].length).to.be.equal(1);
      expect(journalLoadedStub.args[0][0]).to.be.eql(testData);
    });
  });

  describe('#_journalLoaded', () => {
    let dispatchStub;
    let commentLoadStub;
    let getMediaFromTextStub;
    let mediaLoadStub;

    const testTripId1 = 'test-trip-1';
    const testJournalId1 = 'test-journal-1';
    const testJournalText1 = 'test of the journal text';
    let testMediaList = null;

    beforeEach(() => {
      dispatchStub = sinon.stub(AppDispatcher, 'dispatch');
      commentLoadStub = sinon.stub(CommentAction, 'recursivelyLoadComments');
      getMediaFromTextStub = sinon.stub(JournalAction, '_getMediaFromText').callsFake(
        () => {
          return testMediaList;
        });
      mediaLoadStub = sinon.stub(MediaAction, 'loadMedia');
    });

    afterEach(() => {
      mediaLoadStub.restore();
      getMediaFromTextStub.restore();
      commentLoadStub.restore();
      dispatchStub.restore();
    });

    it('dispatch is called with right info', () => {
      const data = {
        tripId: testTripId1,
        journalId: testJournalId1,
        journalText: testJournalText1
      };
      JournalAction._journalLoaded(data);
      expect(dispatchStub.args[0].length).to.be.equal(1);
      const action = dispatchStub.args[0][0];
      expect(action.type).to.be.equal(JournalActionTypes.JOURNAL_DATA);
      expect(action.data).to.be.deep.eql(data);
    });

    describe('recursivelyLoadComments', () => {
      it('is called with right info', () => {
        const data = {
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

      it('is not called without trip ID', () => {
        const data = {
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(commentLoadStub.callCount).to.be.equal(0);
      });

      it('is not called without journal ID', () => {
        const data = {
          tripId: testTripId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(commentLoadStub.callCount).to.be.equal(0);
      });
    });

    describe('loadUser', () => {
      it('is called with the right info', () => {
        const testUser1 = 'test-user-1';
        const data = {
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

      it('is not called without user ID', () => {
        const data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(loadUserStub.callCount).to.be.equal(0);
      });
    });

    describe('getMediaFromText', () => {
      it('is called with the right parameters', () => {
        const data = {
          tripId: testTripId1,
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(1);
        expect(getMediaFromTextStub.args[0].length).to.be.equal(1);
        expect(getMediaFromTextStub.args[0][0]).to.be.equal(testJournalText1);
      });

      it('is not called without a trip ID', () => {
        const data = {
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(0);
      });

      it('is not called without a journal ID', () => {
        const data = {
          tripId: testTripId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(0);
      });

      it('is not called without a trip text', () => {
        const data = {
          tripId: testTripId1,
          journalId: testJournalId1
        };
        JournalAction._journalLoaded(data);
        expect(getMediaFromTextStub.callCount).to.be.equal(0);
      });
    });

    describe('loadMedia', () => {
      beforeEach(() => {
        testMediaList = ['image-1', 'image-2', 'image-3'];
      });

      it('is called with right info', () => {
        const data = {
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

      it('is not called without a trip ID', () => {
        const data = {
          journalId: testJournalId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(0);
      });

      it('is not called without a journal ID', () => {
        const data = {
          tripId: testTripId1,
          journalText: testJournalText1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(0);
      });

      it('is not called without a trip text', () => {
        const data = {
          tripId: testTripId1,
          journalId: testJournalId1
        };
        JournalAction._journalLoaded(data);
        expect(mediaLoadStub.callCount).to.be.equal(0);
      });
    });

    // It looks like recursively loaded comments is commented out in the source,
    // so skip this test.
    describe.skip('recursivelyLoadComments for media', () => {
      beforeEach(() => {
        testMediaList = ['image-1', 'image-2', 'image-3'];
      });

      it('is called with right info', () => {
        const data = {
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

  describe('#getMediaFromText', () => {
    const testImage1 = '111-222';
    const testImage2 = '3333-4444';
    const testText1 = 'This is a text without any images';
    const testText2 = 'test with [' + testImage1 + '] invalid image';

    it('returns null without text', () => {
      const result = JournalAction._getMediaFromText();
      expect(result).to.be.null;
    });

    it('returns empty array for text without images', () => {
      const result = JournalAction._getMediaFromText(testText1);
      expect(result).to.deep.eql([]);
    });

    it('does not return invalid image', () => {
      const result = JournalAction._getMediaFromText(testText2);
      expect(result).to.deep.eql([]);
    });

    describe('single image', () => {
      const testText3 = '[IMG ' + testImage1 + '] test with starting image';
      const testText4 = 'Test with ending image [IMG ' + testImage1 + ']';
      const testText5 = 'Test with [IMG ' + testImage1 + '] middle image';
      const testText6 = 'test with [IMG   ' + testImage1 + '  ] extra space';

      it('returns single image from text, at start', () => {
        const result = JournalAction._getMediaFromText(testText3);
        expect(result).to.deep.eql([testImage1]);
      });

      it('returns single image from text, at end', () => {
        const result = JournalAction._getMediaFromText(testText4);
        expect(result).to.deep.eql([testImage1]);
      });

      it('returns single image from text, in middle', () => {
        const result = JournalAction._getMediaFromText(testText5);
        expect(result).to.deep.eql([testImage1]);
      });

      it('returns single image with extra space', () => {
        const result = JournalAction._getMediaFromText(testText6);
        expect(result).to.deep.eql([testImage1]);
      });
    });

    describe('returns multiple images from text', () => {
      const testText7 = '[IMG ' + testImage1 + '][IMG ' + testImage2 + ']';
      const testText8 = '[IMG ' + testImage1 +
        '] and some text [IMG ' + testImage2 + ']';
      const testText9 = 'initial text [IMG ' +
        testImage1 + '][IMG ' + testImage2 + ']';
      const testText10 = '[IMG ' + testImage1 +
        '][IMG ' + testImage2 + '] final text';
      const testText11 = 'this [IMG ' + testImage1 +
        '] is [IMG ' + testImage2 + '] stuff';

      it('only images', () => {
        const result = JournalAction._getMediaFromText(testText7);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text in the middle', () => {
        const result = JournalAction._getMediaFromText(testText8);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text at the front', () => {
        const result = JournalAction._getMediaFromText(testText9);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text at the end', () => {
        const result = JournalAction._getMediaFromText(testText10);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });

      it('text everywhere', () => {
        const result = JournalAction._getMediaFromText(testText11);
        expect(result).to.deep.eql([testImage1, testImage2]);
      });
    });
  });
});
