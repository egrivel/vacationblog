'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const TestUtils = require('react-addons-test-utils');

const JournalEntry = require('../../src/components/JournalEntry.jsx');
const FeedbackAction = require('../../src/actions/FeedbackAction');

const JournalStore = require('../../src/stores/JournalStore');
const UserStore = require('../../src/stores/UserStore');
const CommentStore = require('../../src/stores/CommentStore');

describe('components/JournalEntry', function() {
  let getJournalDataStub;
  let getUserDataStub;
  let getCommentDataStub;
  let loadFeedbackStub;

  const testUserId = 'test-user-1';
  const testUserName = 'Test User';
  const testTripId = 'test-trip-1';
  const testJournalId = 'test-journal-1';
  const testTitle = 'test-title';
  const testText = 'test-text';
  const testDate = '2016-01-01';
  const testCreated = '2016-02-02';
  const testPrevId = 'prev-id';
  const testNextId = 'next-id';
  const testCommentId = 'test-comment-1';
  const testCommentText = 'test comment text';
  let journalData;

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
    let element;
    const props = {
      tripId: testTripId,
      journalId: testJournalId
    };
    beforeEach(function() {
      element = React.createElement(JournalEntry, props);
    });

    describe('structure', function() {
      it('<h3> elements', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const h3List = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'h3');
        expect(h3List.length).to.be.equal(2);
        expect(h3List[0].className).to.be.equal('');
        expect(h3List[1].className).to.be.equal('');
      });

      it('<p> elements', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const parList = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[0].className).to.be.equal('prevnext');
        expect(parList[1].className).to.be.equal('text');
        expect(parList[2].className).to.be.equal('text');
        expect(parList[3].className).to.be.equal('prevnext');
      });

      it('<div> elements', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(6);
        expect(divList[0].className).to.be.equal('journalitem');
        expect(divList[1].className).to.be.equal('commentAdd');
        expect(divList[2].className).to.be.equal('feedback');
        expect(divList[3].className).to.be.equal('comments');
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[5].className).to.be.equal('feedback');
      });
    });

    describe('render title', function() {
      it('uses <h3>', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const h3List = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'h3');
        expect(h3List.length).to.be.equal(2);
      });

      it('contains title text', function() {
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain(testTitle);
      });

      it('contains author name', function() {
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain(testUserName);
      });

      it('contains author ID if name is not there', function() {
        journalData.userId = 'fake-user-ud';
        element = React.createElement(JournalEntry, props);
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.not.contain(testUserName);
        expect(markup).to.contain(journalData.userId);
      });

      it('contains date', function() {
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('Friday January 1 2016');
      });

      it('contains created', function() {
        const markup = ReactDOMServer.renderToStaticMarkup(element);
        expect(markup).to.contain('Tuesday February 2 2016');
      });
    });

    describe('render prev-next', function() {
      it('render first prevnext', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const parList = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[0].className).to.be.equal('prevnext');
      });

      it('render second prevnext', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const parList = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[3].className).to.be.equal('prevnext');
      });
    });

    describe('render content', function() {
      it('render paragraph', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const parList = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[1].className).to.be.equal('text');
      });

      it('contains journal text', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const parList = TestUtils.scryRenderedDOMComponentsWithTag(
          journal, 'p');
        expect(parList.length).to.be.equal(4);
        expect(parList[1].innerHTML).to.contain(testText);
      });
    });

    describe('render feedback', function() {
      it('render div', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(6);
        expect(divList[2].className).to.be.equal('feedback');
      });
    });

    describe('render comments', function() {
      it('render div', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(6);
        expect(divList[3].className).to.be.equal('comments');
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[5].className).to.be.equal('feedback');
      });

      it('render text', function() {
        const journal = TestUtils.renderIntoDocument(element);
        const divList = TestUtils.scryRenderedDOMComponentsWithTag(journal,
          'div');
        expect(divList.length).to.be.equal(6);
        expect(divList[4].className).to.be.equal('commentBlock');
        expect(divList[4].innerHTML).to.contain(testCommentText);
      });
    });
  });
});
