'use strict';

/* global document */

const expect = require('chai').expect;
const sinon = require('sinon');
const React = require('react');
const ReactDOM = require('react-dom');
const ReactDOMServer = require('react-dom/server');
const TestUtils = require('react-addons-test-utils');

const TripStore = require('../../src/stores/TripStore');
const TripAction = require('../../src/actions/TripAction');
const TripDescription = require('../../src/components/TripDescription.jsx');

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
  const element = getTripDescription(tripId);
  return ReactDOMServer.renderToStaticMarkup(element);
}

/**
 * Render an trip description into the document.
 * @param {string} tripId - ID of the trip description to render.
 * @return {object} DOM node corresponding to the trip description element.
 */
function getDomElement(tripId) {
  const element = getTripDescription(tripId);
  const component = TestUtils.renderIntoDocument(element);
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(component);
}

describe('components/TripDescription', function() {
  // Dummy trip data used in the tests
  const tripId = 'trip-1';
  let tripData;

  // Stub out all the external functions called
  let getTripDataStub;
  let getCurrentTripIdStub;
  let initialLoadTripStub;
  let setCurrentTripStub;
  let addChangeListenerStub;
  let removeChangeListenerStub;

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
      const markup = getHtmlMarkup(tripId);
      const tripDescr = '<div class="trip"><p class="text">' +
        tripData.description + '</p><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });
    it('render read journal link', function() {
      const markup = getHtmlMarkup(tripId);
      expect(markup).to.match(/<a.*?>Start reading journal.*?<\/a>/);
    });

    it('render description if no trip ID', function() {
      const markup = getHtmlMarkup(null);
      const tripDescr = '<div class="trip"><p class="text">' +
        tripData.description + '</p><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('does not render description if no description', function() {
      delete tripData.description;
      const markup = getHtmlMarkup(tripId);
      const tripDescr = '<div class="trip"><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('render multiple-line description in multiple paragraphs', function() {
      tripData.description = 'paragraph 1&lf;paragraph 2';
      const markup = getHtmlMarkup(tripId);
      const tripDescr = '<div class="trip"><p class="text">paragraph 1</p>' +
        '<p class="text">paragraph 2</p><p class="readJournal">';
      expect(markup).to.contain(tripDescr);
    });

    it('render (no journal entries) if no journal ID', function() {
      delete tripData.firstJournalId;
      const markup = getHtmlMarkup(tripId);
      expect(markup).to.not.match(/<a.*?>Start reading journal.*?<\/a>/);
      expect(markup).to.contain('(no journal entries)');
    });
  });

  describe('mount', function() {
    it('adds change listener', function() {
      expect(addChangeListenerStub.callCount).to.be.equal(0);

      const container = document.createElement('div');
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

      const container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(removeChangeListenerStub.callCount).to.be.equal(0);

      ReactDOM.unmountComponentAtNode(container);
      expect(removeChangeListenerStub.callCount).to.be.equal(1);
    });
  });

  describe('mount with different tripId', function() {
    const otherTripId = 'other-trip-id';

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
    const otherTripId = null;

    it('calls getCurrentTripId', function() {
      expect(getCurrentTripIdStub.callCount).to.be.equal(0);
      getDomElement(otherTripId);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
    });

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
    const otherTripId = 'other-trip-id';

    it('does not call initialLoadTrip', function() {
      const container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(initialLoadTripStub.callCount).to.be.equal(0);
    });

    it('calls setCurrentTrip', function() {
      const container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(setCurrentTripStub.callCount).to.be.equal(0);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(setCurrentTripStub.callCount).to.be.equal(1);
    });

    it('calls getCurrentTripId', function() {
      const container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(getCurrentTripIdStub.callCount).to.be.equal(1);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(getCurrentTripIdStub.callCount).to.be.equal(2);
    });

    it('does not call getTripData', function() {
      // note: getTripData is triggered by the change event that the store
      // will emit as a response to loading data.
      const container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(getTripDataStub.callCount).to.be.equal(1);
      ReactDOM.render(getTripDescription(otherTripId), container);
      expect(getTripDataStub.callCount).to.be.equal(1);
    });
  });

  describe('change event', function() {
    it('retrieves state from stores', function() {
      expect(addChangeListenerStub.callCount).to.be.equal(0);

      const container = document.createElement('div');
      ReactDOM.render(getTripDescription(tripId), container);
      expect(addChangeListenerStub.callCount).to.be.equal(1);

      // Get the _onChange function
      const func = addChangeListenerStub.firstCall.args[0];

      expect(getTripDataStub.callCount).to.be.equal(1);
      func();
      expect(getTripDataStub.callCount).to.be.equal(2);
    });
  });
});
