'use strict';

/* global document */

var expect = require('chai').expect;
var sinon = require('sinon');
var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');

var TripDescription = require('../../src/components/TripDescription');
var TripStore = require('../../src/stores/TripStore');
var TripAction = require('../../src/actions/TripAction');

/**
 * Create a trip description element.
 * @param {string} tripId - unique ID of the trip to get.
 * @return {object} React element for the trip description.
 */
function getTripDescription(tripId) {
  return React.createElement(TripDescription, {
    params: {
      tripId: tripId
    }
  });
}

/**
 * Render a trip description into HTML.
 * @param {string} tripId - ID of the trip description to render.
 * @return {string} HTML representation of the rendered trip description.
 */
function getHtmlMarkup(tripId) {
  var element = getTripDescription(tripId);
  return React.renderToStaticMarkup(element);
}

/**
 * Render an trip description into the document.
 * @param {string} tripId - ID of the trip description to render.
 * @return {object} DOM node corresponding to the trip description element.
 */
function getDomElement(tripId) {
  var element = getTripDescription(tripId);
  var component = TestUtils.renderIntoDocument(element);
  return ReactDOM.findDOMNode(component);
}

describe('TripDescription component', function() {
  // Dummy trip data used in the tests
  var tripId = 'trip-1';
  var tripData;

  // Stub out all the external functions called
  var getTripDataStub;
  var getCurrentTripIdStub;
  var initialLoadTripStub;
  var setCurrentTripStub;
  var addChangeListenerStub;
  var removeChangeListenerStub;

  beforeEach(function() {
    tripData = {
      tripId: tripId,
      description: 'trip description',
      firstJournalId: 'journal-1'
    };

    getTripDataStub = sinon.stub(TripStore, 'getTripData', function() {
      return tripData;
    });
    getCurrentTripIdStub = sinon.stub(TripStore,
                                      'getCurrentTripId', function() {
                                        return tripId;
                                      });
    initialLoadTripStub = sinon.stub(TripAction, 'initialLoadTrip');
    setCurrentTripStub = sinon.stub(TripAction, 'setCurrentTrip');
    addChangeListenerStub = sinon.stub(TripStore, 'addChangeListener');
    removeChangeListenerStub = sinon.stub(TripStore, 'removeChangeListener');
  });

  afterEach(function() {
    removeChangeListenerStub.restore();
    addChangeListenerStub.restore();
    setCurrentTripStub.restore();
    initialLoadTripStub.restore();
    getCurrentTripIdStub.restore();
    getTripDataStub.restore();
  });

  describe('#render', function() {
    it('render trip class', function() {
      var markup = getHtmlMarkup(tripId);
      var tripDescr = '<div class="trip"><p class="text">' +
        tripData.description + '</p><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('render read journal link', function() {
      var markup = getHtmlMarkup(tripId);
      expect(markup).to.match(/<a.*?>Start reading journal.*?<\/a>/);
    });

    it('render description if no trip ID', function() {
      var markup = getHtmlMarkup(null);
      var tripDescr = '<div class="trip"><p class="text">' +
        tripData.description + '</p><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('does not render description if no description', function() {
      delete tripData.description;
      var markup = getHtmlMarkup(tripId);
      var tripDescr = '<div class="trip"><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('render multiple-line description in multiple paragraphs', function() {
      tripData.description = 'paragraph 1&lf;paragraph 2';
      var markup = getHtmlMarkup(tripId);
      var tripDescr = '<div class="trip"><p class="text">paragraph 1</p>' +
        '<p class="text">paragraph 2</p><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('render (no journal entries) if no journal ID', function() {
      delete tripData.firstJournalId;
      var markup = getHtmlMarkup(tripId);
      expect(markup).to.not.match(/<a.*?>Start reading journal.*?<\/a>/);
      expect(markup).to.contain('(no journal entries)');
    });
  });

  describe('mount', function() {
    it('adds change listener', function() {
      expect(addChangeListenerStub.callCount).to.be.equal(0);

      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);

      expect(addChangeListenerStub.callCount).to.be.equal(1);
    });

    it('does not call initialLoadTrip', function() {
      expect(initialLoadTripStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
    });

    it('does not call setCurrentTrip', function() {
      expect(setCurrentTripStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(setCurrentTripStub.callCount).to.be.equal(0);
    });

    it('calls getCurrentTripId', function() {
      expect(getCurrentTripIdStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
    });

    it('calls getTripData', function() {
      expect(getTripDataStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(getTripDataStub.callCount).to.be.equal(1);
    });
  });

  describe('unmount', function() {
    it('removes change listener', function() {
      expect(removeChangeListenerStub.callCount).to.be.equal(0);

      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(removeChangeListenerStub.callCount).to.be.equal(0);

      ReactDOM.unmountComponentAtNode(container);
      expect(removeChangeListenerStub.callCount).to.be.equal(1);
    });
  });

  describe('mount with different tripId', function() {
    var otherTripId = 'other-trip-id';

    it('does not call initialLoadTrip', function() {
      expect(initialLoadTripStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
    });

    it('calls setCurrentTrip', function() {
      expect(setCurrentTripStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(setCurrentTripStub.callCount).to.be.equal(1);
    });

    it('calls getCurrentTripId', function() {
      expect(getCurrentTripIdStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
    });

    it('calls getTripData', function() {
      expect(getTripDataStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(getTripDataStub.callCount).to.be.equal(1);
    });
  });

  describe('mount without tripId', function() {
    var otherTripId = null;

    it('calls initialLoadTrip', function() {
      expect(initialLoadTripStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(initialLoadTripStub.callCount).to.be.equal(1);
    });

    it('does not call setCurrentTrip', function() {
      expect(setCurrentTripStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(setCurrentTripStub.callCount).to.be.equal(0);
    });

    it('calls getCurrentTripId', function() {
      expect(getCurrentTripIdStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
    });

    it('calls getTripData', function() {
      expect(getTripDataStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(getTripDataStub.callCount).to.be.equal(1);
    });
  });

  describe('mount with no data in store', function() {
    beforeEach(function() {
      tripData = {};
    });

    it('does not call initialLoadTrip', function() {
      expect(initialLoadTripStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
    });

    it('does not call setCurrentTrip', function() {
      expect(setCurrentTripStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(setCurrentTripStub.callCount).to.be.equal(0);
    });

    it('calls getCurrentTripId', function() {
      expect(getCurrentTripIdStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
    });

    it('calls getTripData', function() {
      expect(getTripDataStub.callCount).to.be.equal(0);
      getDomElement(tripId);
      expect(getTripDataStub.callCount).to.be.equal(1);
    });
  });

  describe('update with different trip ID', function() {
    var otherTripId = 'other-trip-id';

    it('does not call initialLoadTrip', function() {
      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
    });

    it('calls setCurrentTrip', function() {
      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(setCurrentTripStub.callCount).to.be.equal(0);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(setCurrentTripStub.callCount).to.be.equal(1);
    });

    it('calls getCurrentTripId', function() {
      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(getCurrentTripIdStub.callCount).to.be.equal(2);
    });

    it('does not call getTripData', function() {
      // note: getTripData is triggered by the change event that the store
      // will emit as a response to loading data.
      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(getTripDataStub.callCount).to.be.equal(1);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(getTripDataStub.callCount).to.be.equal(1);
    });
  });

  describe('change event', function() {
    it('retrieves state from stores', function() {
      expect(addChangeListenerStub.callCount).to.be.equal(0);

      var container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(addChangeListenerStub.callCount).to.be.equal(1);

      // Get the _onChange function
      var func = addChangeListenerStub.firstCall.args[0];

      expect(getTripDataStub.callCount).to.be.equal(1);
      func();
      expect(getTripDataStub.callCount).to.be.equal(2);
    });
  });
});
