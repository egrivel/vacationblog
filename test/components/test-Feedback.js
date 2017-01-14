'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const React = require('react');
const ReactDOM = require('react-dom');
const TestUtils = require('react-addons-test-utils');

const UserStore = require('../../src/stores/UserStore');
const FeedbackStore = require('../../src/stores/FeedbackStore');
const FeedbackAction = require('../../src/actions/FeedbackAction');

const Feedback = require('../../src/components/Feedback.jsx');

/**
 * Get the count value for the Facebook feedback.
 * @param {object} feedback - feedback object to inspect.
 * @return {int} count in the object.
 */
function getFacebookCount(feedback) {
  expect(feedback.children.length).to.be.equal(4);
  expect(feedback.children[0].textContent).to.exist;
  const result = /^\uF087\s+(\d+)/.exec(feedback.children[0].textContent);
  return parseInt(result[1], 10);
}

/**
 * Get the count value for the Google feedback.
 * @param {object} feedback - feedback object to inspect.
 * @return {int} count in the object.
 */
function getGoogleCount(feedback) {
  expect(feedback.children.length).to.be.equal(4);
  expect(feedback.children[2].textContent).to.exist;
  const result = /^\uF067\s+(\d+)/.exec(feedback.children[2].textContent);
  return parseInt(result[1], 10);
}

/**
 * Inspect the list of facebook feedback items
 * @param {object} feedback - feedback object to inspect
 * @return {string} title
 */
function getFacebookList(feedback) {
  expect(feedback.children.length).to.be.equal(4);
  expect(feedback.children[0].title).to.exist;
  return feedback.children[0].title;
}

/**
 * Inspect the list of google feedback items
 * @param {object} feedback - feedback object to inspect
 * @return {string} title
 */
function getGoogleList(feedback) {
  expect(feedback.children.length).to.be.equal(4);
  expect(feedback.children[2].title).to.exist;
  return feedback.children[2].title;
}

describe('components/Feedback', function() {
  let getLoggedInUserStub;
  let loadDataStub;
  let getLikeCountStub;
  let getPlusCountStub;
  let getLikeListStub;
  let getPlusListStub;
  let doesUserLikeStub;
  let doesUserPlusStub;
  let setLikeStub;
  let clearLikeStub;
  let setPlusStub;
  let clearPlusStub;

  let testLoggedInUser;
  let testLikeCount;
  let testPlusCount;
  let testLikeList;
  let testPlusList;
  let testDoesUserLike;
  let testDoesUserPlus;

  let testTripId;
  let testReferenceId;

  beforeEach(function() {
    testTripId = 'test-trip';
    testReferenceId = 'test-ref';
    testLoggedInUser = 'test-user';
    testLikeCount = 3;
    testPlusCount = 5;
    testLikeList = 'john, jane, bob';
    testPlusList = 'alic, paul, peter, jane, fred';
    testDoesUserLike = false;
    testDoesUserPlus = false;

    getLoggedInUserStub = sinon.stub(UserStore, 'getLoggedInUser', function() {
      return testLoggedInUser;
    });
    loadDataStub = sinon.stub(FeedbackAction, 'loadData');
    getLikeCountStub = sinon.stub(FeedbackStore, 'getLikeCount', function() {
      return testLikeCount;
    });
    getPlusCountStub = sinon.stub(FeedbackStore, 'getPlusCount', function() {
      return testPlusCount;
    });
    getLikeListStub = sinon.stub(FeedbackStore, 'getLikeList', function() {
      return testLikeList;
    });
    getPlusListStub = sinon.stub(FeedbackStore, 'getPlusList', function() {
      return testPlusList;
    });
    doesUserLikeStub = sinon.stub(FeedbackStore, 'doesUserLike', function() {
      return testDoesUserLike;
    });
    doesUserPlusStub = sinon.stub(FeedbackStore, 'doesUserPlus', function() {
      return testDoesUserPlus;
    });
    setLikeStub = sinon.stub(FeedbackAction, 'setLike');
    clearLikeStub = sinon.stub(FeedbackAction, 'clearLike');
    setPlusStub = sinon.stub(FeedbackAction, 'setPlus');
    clearPlusStub = sinon.stub(FeedbackAction, 'clearPlus');
  });

  afterEach(function() {
    clearPlusStub.restore();
    setPlusStub.restore();
    clearLikeStub.restore();
    setLikeStub.restore();
    doesUserPlusStub.restore();
    doesUserLikeStub.restore();
    getPlusListStub.restore();
    getLikeListStub.restore();
    getPlusCountStub.restore();
    getLikeCountStub.restore();
    loadDataStub.restore();
    getLoggedInUserStub.restore();
  });

  describe('#render', function() {
    describe('without props', function() {
      let feedback;
      beforeEach(function() {
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, null));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('calls user store', function() {
        expect(getLoggedInUserStub.callCount).to.be.equal(1);
      });

      it('does not load data', function() {
        expect(loadDataStub.callCount).to.be.equal(0);
      });

      it('does not call feedback store', function() {
        expect(getLikeCountStub.callCount, 'getLikeCount').to.be.equal(0);
        expect(getPlusCountStub.callCount, 'getPlusCount').to.be.equal(0);
        expect(getLikeListStub.callCount, 'getLikeList').to.be.equal(0);
        expect(getPlusListStub.callCount, 'getPlusList').to.be.equal(0);
        expect(doesUserLikeStub.callCount, 'doesUserLikeCount').to.be.equal(0);
        expect(doesUserPlusStub.callCount, 'doesUserPlusCount').to.be.equal(0);
      });

      it('render facebook count zero', function() {
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[1].textContent)
          .to.be.equal('\u00A0 facebook. \u00A0');
        const count = getFacebookCount(feedback);
        expect(count).to.be.equal(0);
      });

      it('render google count zero', function() {
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[3].textContent).to.be.equal('\u00A0 Google.');
        const count = getGoogleCount(feedback);
        expect(count).to.be.equal(0);
      });
    });

    describe('without just trip ID', function() {
      let feedback;
      beforeEach(function() {
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {tripId: testTripId}));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('calls user store', function() {
        expect(getLoggedInUserStub.callCount).to.be.equal(1);
      });

      it('does not load data', function() {
        expect(loadDataStub.callCount).to.be.equal(0);
      });

      it('does not call feedback store', function() {
        expect(getLikeCountStub.callCount, 'getLikeCount').to.be.equal(0);
        expect(getPlusCountStub.callCount, 'getPlusCount').to.be.equal(0);
        expect(getLikeListStub.callCount, 'getLikeList').to.be.equal(0);
        expect(getPlusListStub.callCount, 'getPlusList').to.be.equal(0);
        expect(doesUserLikeStub.callCount, 'doesUserLikeCount').to.be.equal(0);
        expect(doesUserPlusStub.callCount, 'doesUserPlusCount').to.be.equal(0);
      });

      it('render facebook count zero', function() {
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[1].textContent)
          .to.be.equal('\u00A0 facebook. \u00A0');
        const count = getFacebookCount(feedback);
        expect(count).to.be.equal(0);
      });

      it('render google count zero', function() {
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[3].textContent).to.be.equal('\u00A0 Google.');
        const count = getGoogleCount(feedback);
        expect(count).to.be.equal(0);
      });
    });

    describe('with just reference ID', function() {
      let feedback;
      beforeEach(function() {
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {referenceId: testReferenceId}));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('calls user store', function() {
        expect(getLoggedInUserStub.callCount).to.be.equal(1);
      });

      it('does not load data', function() {
        expect(loadDataStub.callCount).to.be.equal(0);
      });

      it('does not call feedback store', function() {
        expect(getLikeCountStub.callCount, 'getLikeCount').to.be.equal(0);
        expect(getPlusCountStub.callCount, 'getPlusCount').to.be.equal(0);
        expect(getLikeListStub.callCount, 'getLikeList').to.be.equal(0);
        expect(getPlusListStub.callCount, 'getPlusList').to.be.equal(0);
        expect(doesUserLikeStub.callCount, 'doesUserLikeCount').to.be.equal(0);
        expect(doesUserPlusStub.callCount, 'doesUserPlusCount').to.be.equal(0);
      });

      it('render facebook count zero', function() {
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[1].textContent)
          .to.be.equal('\u00A0 facebook. \u00A0');
        const count = getFacebookCount(feedback);
        expect(count).to.be.equal(0);
      });

      it('render google count zero', function() {
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[3].textContent).to.be.equal('\u00A0 Google.');
        const count = getGoogleCount(feedback);
        expect(count).to.be.equal(0);
      });
    });

    describe('with tripId and referenceId', function() {
      let feedback;
      beforeEach(function() {
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {
            tripId: testTripId,
            referenceId: testReferenceId
          }));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('calls user store', function() {
        expect(getLoggedInUserStub.callCount).to.be.equal(1);
      });

      it('loads data', function() {
        expect(loadDataStub.callCount).to.be.equal(1);
        expect(loadDataStub.args[0].length).to.be.equal(2);
        expect(loadDataStub.args[0][0]).to.be.equal(testTripId);
        expect(loadDataStub.args[0][1]).to.be.equal(testReferenceId);
      });

      it('calls getLikeCount', function() {
        expect(getLikeCountStub.callCount).to.be.equal(1);
        expect(getLikeCountStub.args[0].length).to.be.equal(2);
        expect(getLikeCountStub.args[0][0]).to.be.equal(testTripId);
        expect(getLikeCountStub.args[0][1]).to.be.equal(testReferenceId);
      });

      it('calls getPlusCount', function() {
        expect(getPlusCountStub.callCount).to.be.equal(1);
        expect(getPlusCountStub.args[0].length).to.be.equal(2);
        expect(getPlusCountStub.args[0][0]).to.be.equal(testTripId);
        expect(getPlusCountStub.args[0][1]).to.be.equal(testReferenceId);
      });

      it('calls getLikeList', function() {
        expect(getLikeListStub.callCount).to.be.equal(1);
        expect(getLikeListStub.args[0].length).to.be.equal(3);
        expect(getLikeListStub.args[0][0]).to.be.equal(testTripId);
        expect(getLikeListStub.args[0][1]).to.be.equal(testReferenceId);
        expect(getLikeListStub.args[0][2]).to.be.equal(testLoggedInUser);
      });

      it('calls getPlusList', function() {
        expect(getPlusListStub.callCount).to.be.equal(1);
        expect(getPlusListStub.args[0].length).to.be.equal(3);
        expect(getPlusListStub.args[0][0]).to.be.equal(testTripId);
        expect(getPlusListStub.args[0][1]).to.be.equal(testReferenceId);
        expect(getPlusListStub.args[0][2]).to.be.equal(testLoggedInUser);
      });

      it('calls doesUserLike', function() {
        expect(doesUserLikeStub.callCount).to.be.equal(1);
        expect(doesUserLikeStub.args[0].length).to.be.equal(3);
        expect(doesUserLikeStub.args[0][0]).to.be.equal(testTripId);
        expect(doesUserLikeStub.args[0][1]).to.be.equal(testReferenceId);
        expect(doesUserLikeStub.args[0][2]).to.be.equal(testLoggedInUser);
      });

      it('calls doesUserPlus', function() {
        expect(doesUserPlusStub.callCount).to.be.equal(1);
        expect(doesUserPlusStub.args[0].length).to.be.equal(3);
        expect(doesUserPlusStub.args[0][0]).to.be.equal(testTripId);
        expect(doesUserPlusStub.args[0][1]).to.be.equal(testReferenceId);
        expect(doesUserPlusStub.args[0][2]).to.be.equal(testLoggedInUser);
      });

      it('render facebook count three', function() {
        // note: 3 is the default return value of the getLikeCount stub
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[1].textContent)
          .to.be.equal('\u00A0 facebook. \u00A0');
        const count = getFacebookCount(feedback);
        expect(count).to.be.equal(3);
      });

      it('render google count five', function() {
        // note: 5 is the default return value of the getPlusCount stub
        expect(feedback.children.length).to.be.equal(4);
        expect(feedback.children[3].textContent).to.be.equal('\u00A0 Google.');
        const count = getGoogleCount(feedback);
        expect(count).to.be.equal(5);
      });

      it('renders like list', function() {
        const list = getFacebookList(feedback);
        expect(list).to.contain(testLikeList);
        expect(list).to.not.contain('You');
      });

      it('renders plus list', function() {
        const list = getGoogleList(feedback);
        expect(list).to.contain(testPlusList);
        expect(list).to.not.contain('You');
      });
    });

    describe('include user in like list', function() {
      let feedback;
      beforeEach(function() {
        testDoesUserLike = true;
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {
            tripId: testTripId,
            referenceId: testReferenceId
          }));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('renders like list with user', function() {
        const list = getFacebookList(feedback);
        expect(list).to.contain(testLikeList);
        expect(list).to.contain('You and');
      });

      it('renders plus list without user', function() {
        const list = getGoogleList(feedback);
        expect(list).to.contain(testPlusList);
        expect(list).to.not.contain('You');
      });
    });

    describe('include user in plus list', function() {
      let feedback;
      beforeEach(function() {
        testDoesUserPlus = true;
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {
            tripId: testTripId,
            referenceId: testReferenceId
          }));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('renders like list without user', function() {
        const list = getFacebookList(feedback);
        expect(list).to.contain(testLikeList);
        expect(list).to.not.contain('You');
      });

      it('renders plus list with user', function() {
        const list = getGoogleList(feedback);
        expect(list).to.contain(testPlusList);
        expect(list).to.contain('You and');
      });
    });

    describe('only user likes - render list', function() {
      let feedback;
      beforeEach(function() {
        testDoesUserLike = true;
        testLikeList = '';
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {
            tripId: testTripId,
            referenceId: testReferenceId
          }));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('renders like list with user', function() {
        const list = getFacebookList(feedback);
        expect(list).to.contain('You');
        expect(list).to.not.contain('You and');
      });
    });

    describe('only user pluses - render list', function() {
      let feedback;
      beforeEach(function() {
        testDoesUserPlus = true;
        testPlusList = '';
        const component = TestUtils.renderIntoDocument(
          React.createElement(Feedback, {
            tripId: testTripId,
            referenceId: testReferenceId
          }));
        // eslint-disable-next-line react/no-find-dom-node
        feedback = ReactDOM.findDOMNode(component);
      });

      it('renders plus list with user', function() {
        const list = getGoogleList(feedback);
        expect(list).to.contain('You');
        expect(list).to.not.contain('You and');
      });
    });
  });

  describe('clicking to set like/plus works', function() {
    let feedback;
    beforeEach(function() {
      const component = TestUtils.renderIntoDocument(
        React.createElement(Feedback, {
          tripId: testTripId,
          referenceId: testReferenceId
        }));
      // eslint-disable-next-line react/no-find-dom-node
      feedback = ReactDOM.findDOMNode(component);
    });

    it('click Like sends action', function() {
      TestUtils.Simulate.click(feedback.children[0]);
      expect(setLikeStub.callCount).to.be.equal(1, 'setLike');
      expect(clearLikeStub.callCount).to.be.equal(0, 'clearLike');
      expect(setPlusStub.callCount).to.be.equal(0, 'setPlus');
      expect(clearPlusStub.callCount).to.be.equal(0, 'clearPlus');
    });

    it('click Plus sends action', function() {
      TestUtils.Simulate.click(feedback.children[2]);
      expect(setLikeStub.callCount).to.be.equal(0, 'setLike');
      expect(clearLikeStub.callCount).to.be.equal(0, 'clearLike');
      expect(setPlusStub.callCount).to.be.equal(1, 'setPlus');
      expect(clearPlusStub.callCount).to.be.equal(0, 'clearPlus');
    });
  });

  describe('clicking to clear like/plus works', function() {
    let feedback;
    beforeEach(function() {
      testDoesUserLike = true;
      testDoesUserPlus = true;
      const component = TestUtils.renderIntoDocument(
        React.createElement(Feedback, {
          tripId: testTripId,
          referenceId: testReferenceId
        }));
      // eslint-disable-next-line react/no-find-dom-node
      feedback = ReactDOM.findDOMNode(component);
    });

    it('click Like sends action', function() {
      TestUtils.Simulate.click(feedback.children[0]);
      expect(setLikeStub.callCount).to.be.equal(0, 'setLike');
      expect(clearLikeStub.callCount).to.be.equal(1, 'clearLike');
      expect(setPlusStub.callCount).to.be.equal(0, 'setPlus');
      expect(clearPlusStub.callCount).to.be.equal(0, 'clearPlus');
    });

    it('click Plus sends action', function() {
      TestUtils.Simulate.click(feedback.children[2]);
      expect(setLikeStub.callCount).to.be.equal(0, 'setLike');
      expect(clearLikeStub.callCount).to.be.equal(0, 'clearLike');
      expect(setPlusStub.callCount).to.be.equal(0, 'setPlus');
      expect(clearPlusStub.callCount).to.be.equal(1, 'clearPlus');
    });
  });

  describe('no action clicking like/plus without user ID', function() {
    let feedback;
    beforeEach(function() {
      testLoggedInUser = '';
      const component = TestUtils.renderIntoDocument(
        React.createElement(Feedback, {
          tripId: testTripId,
          referenceId: testReferenceId
        }));
      // eslint-disable-next-line react/no-find-dom-node
      feedback = ReactDOM.findDOMNode(component);
    });

    it('click Like does not send action', function() {
      TestUtils.Simulate.click(feedback.children[0]);
      expect(setLikeStub.callCount).to.be.equal(0, 'setLike');
      expect(clearLikeStub.callCount).to.be.equal(0, 'clearLike');
      expect(setPlusStub.callCount).to.be.equal(0, 'setPlus');
      expect(clearPlusStub.callCount).to.be.equal(0, 'clearPlus');
    });

    it('click Plus does not send action', function() {
      TestUtils.Simulate.click(feedback.children[2]);
      expect(setLikeStub.callCount).to.be.equal(0, 'setLike');
      expect(clearLikeStub.callCount).to.be.equal(0, 'clearLike');
      expect(setPlusStub.callCount).to.be.equal(0, 'setPlus');
      expect(clearPlusStub.callCount).to.be.equal(0, 'clearPlus');
    });
  });
});
