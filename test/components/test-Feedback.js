'use strict';

var expect = require('chai').expect;
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var Feedback = require('../../src/components/Feedback.jsx');

/**
 * Get the count value for the Facebook feedback.
 * @param {object} feedback - feedback object to inspect.
 * @return {int} count in the object.
 */
function getFacebookCount(feedback) {
  expect(feedback.children.length).to.be.equal(4);
  expect(feedback.children[0].textContent).to.exist;
  var result = /^\uF087\s+(\d+)/.exec(feedback.children[0].textContent);
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
  var result = /^\uF067\s+(\d+)/.exec(feedback.children[2].textContent);
  return parseInt(result[1], 10);
}

describe('src/components/Feedback', function() {
  describe('#render', function() {
    var feedback;
    beforeEach(function() {
      var component = TestUtils.renderIntoDocument(
        React.createElement(Feedback, null));
      feedback = ReactDOM.findDOMNode(component);
    });

    it('render facebook count', function() {
      expect(feedback.children.length).to.be.equal(4);
      expect(feedback.children[1].textContent).to.be.equal('\u00A0 facebook. \u00A0');
      var count = getFacebookCount(feedback);
      expect(count).to.be.equal(0);
    });

    it('render google count', function() {
      expect(feedback.children.length).to.be.equal(4);
      expect(feedback.children[3].textContent).to.be.equal('\u00A0 Google.');
      var count = getGoogleCount(feedback);
      expect(count).to.be.equal(0);
    });

    // it('increment facebook count', function() {
    //   expect(getFacebookCount(feedback)).to.be.equal(0);
    //   expect(getGoogleCount(feedback)).to.be.equal(0);

    //   TestUtils.Simulate.click(feedback.children[0]);
    //   expect(getFacebookCount(feedback)).to.be.equal(1);
    //   expect(getGoogleCount(feedback)).to.be.equal(0);
    // });

    // it('increment google count', function() {
    //   expect(getFacebookCount(feedback)).to.be.equal(0);
    //   expect(getGoogleCount(feedback)).to.be.equal(0);

    //   TestUtils.Simulate.click(feedback.children[2]);
    //   expect(getFacebookCount(feedback)).to.be.equal(0);
    //   expect(getGoogleCount(feedback)).to.be.equal(1);
    // });
  });
});
