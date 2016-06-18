'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var TestUtils = require('react-addons-test-utils');

var JournalEntry = require('../../src/components/JournalEntry.jsx');
var FeedbackAction = require('../../src/actions/FeedbackAction');

var JournalStore = require('../../src/stores/JournalStore');
var UserStore = require('../../src/stores/UserStore');
var CommentStore = require('../../src/stores/CommentStore');

describe('/src/components/JournalEntry', function() {
  var getJournalDataStub;
  var getUserDataStub;
  var getCommentDataStub;
  var loadFeedbackStub;

  var testUserId = 'test-user-1';
  var testUserName = 'Test User';
  var testTripId = 'test-trip-1';
  var testJournalId = 'test-journal-1';
  var testTitle = 'test-title';
  var testText = 'test-text';
  var testDate = '2016-01-01';
  var testCreated = '2016-02-02';
  var testPrevId = 'prev-id';
  var testNextId = 'next-id';
  var testCommentId = 'test-comment-1';
  var testCommentText = 'test comment text';
  var journalData;

  beforeEach(function() {
    getJournalDataStub = sinon.stub(JournalStore, 'getData',
      function() {
        return journalData;
      });
    getUserDataStub = sinon.stub(UserStore, 'getData', function(userId) {
      if (userId === 'test-user-1') {
        return {
          name: testUserName
        };
      }
      return null;
    });
    getCommentDataStub = sinon.stub(CommentStore, 'getRecursiveList',
      function() {
        return [{
          tripId: testTripId,
          commentId: testCommentId,
          referenceId: testJournalId,
          commentText: testCommentText
        }];
      });
    loadFeedbackStub = sinon.stub(FeedbackAction, 'loadData');
    journalData = {
      tripId: testTripId,
      journalId: testJournalId,
      userId: testUserId,
      journalTitle: testTitle,
      journalText: testText,
      journalDate: testDate,
      created: testCreated,
      prevId: testPrevId,
      nextId: testNextId
    };
  });

  afterEach(function() {
    getJournalDataStub.restore();
    getUserDataStub.restore();
    getCommentDataStub.restore();
    loadFeedbackStub.restore();
  });

  describe('render journal entry', function() {
    var element;
    var props = {
      tripId: testTripId,
      journalId: testJournalId
    };
    beforeEach(function() {
      element = React.createElement(JournalEntry, props);
    });

    describe('structure', function() {
      it('<h3> elements', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var h3List = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'h3');
        expect(h3List.length).to.be.equal(2);
        expect(h3List[0].className).to.be.equal('');
        expect(h3List[1].className).to.be.equal('');
      });

      it('<p> elements', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[0].className).to.be.equal('prevnext');
        expect(parList[1].className).to.be.equal('text');
        expect(parList[2].className).to.be.equal('text');
        expect(parList[3].className).to.be.equal('prevnext');
      });

      it('<div> elements', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(7);
        expect(divList[0].className).to.be.equal('journalitem');
        expect(divList[1].className).to.be.equal('commentEdit');
        expect(divList[2].className).to.be.equal('feedback');
        expect(divList[3].className).to.be.equal('comments');
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[5].className).to.be.equal('commentEdit');
        expect(divList[6].className).to.be.equal('feedback');
      });
    });

    describe('render title', function() {
      it('uses <h3>', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var h3List = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'h3');
        expect(h3List.length).to.be.equal(2);
      });

      it('contains title text', function() {
        var markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain(testTitle);
      });

      it('contains author name', function() {
        var markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain(testUserName);
      });

      it('contains author ID if name is not there', function() {
        journalData.userId = 'fake-user-ud';
        element = React.createElement(JournalEntry, props);
        var markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.not.contain(testUserName);
        expect(markup).to.contain(journalData.userId);
      });

      it('contains date', function() {
        var markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('Friday January 1 2016');
      });

      it('contains created', function() {
        var markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('Tuesday February 2 2016');
      });
    });

    describe('render prev-next', function() {
      it('render first prevnext', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[0].className).to.be.equal('prevnext');
      });

      it('render second prevnext', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[3].className).to.be.equal('prevnext');
      });
    });

    describe('render content', function() {
      it('render paragraph', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[1].className).to.be.equal('text');
      });

      it('contains journal text', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var parList = TestUtils.scryRenderedDOMComponentsWithTag(journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[1].innerHTML).to.contain(testText);
      });
    });

    describe('render feedback', function() {
      it('render div', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(7);
        expect(divList[2].className).to.be.equal('feedback');
      });
    });

    describe('render comments', function() {
      it('render div', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(7);
        expect(divList[3].className).to.be.equal('comments');
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[6].className).to.be.equal('feedback');
      });

      it('render text', function() {
        var journal = TestUtils.renderIntoDocument(element);
        var divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(7);
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[4].innerHTML).to.contain(testCommentText);
      });
    });
  });
});
