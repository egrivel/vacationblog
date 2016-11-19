'use strict';

var React = require('react');
var Link = require('react-router').Link;
var moment = require('moment-timezone');

var TripAction = require('../actions/TripAction');
var TripStore = require('../stores/TripStore');

// var Paragraph = require('./Paragraph');
var TripJournalList = require('./TripJournalList.jsx');
var utils = require('./utils');

/**
 * Get the state from the stores.
 * @return {object} new state content.
 * @private
 */
function _getStateFromStores() {
  const tripData = TripStore.getTripData();
  const tripId = tripData.tripId;
  const description = tripData.description;
  const firstJournalId = tripData.firstJournalId;
  return {
    tripId: tripId,
    description: description,
    firstJournalId: firstJournalId
  };
}

/**
 * Output a 'start reading' link for a trip. This link goes to the first
 * journal entry for the trip.
 * @param {id} tripId - trip for which to generate the link.
 * @param {id} journalId - journal entry to target in the link.
 * @return {object} React element to render the link.
 * @private
 */
function _startReadingLink(tripId, journalId) {
  var journalPart = '(no journal entries)';
  if (journalId) {
    journalPart = React.DOM.span(
      {
        className: 'readJournalLink'
      },
      React.createElement(
        Link,
        {
          to: '/journal/' + tripId + '/' + journalId
        },
        'Start reading at the beginning ',
        React.DOM.i({className: 'fa fa-chevron-right'}),
        React.DOM.i({className: 'fa fa-chevron-right'})
      )
    );
  }

  return React.DOM.p(
    {className: 'readJournal'},
    journalPart
  );
}

var TripDescription = React.createClass({
  displayName: 'TripDescription',

  getInitialState: function() {
    return _getStateFromStores();
  },

  _onChange: function() {
    this.setState(_getStateFromStores());
  },

  componentDidMount: function() {
    TripStore.addChangeListener(this._onChange);
    this.getDataIfNeeded(this.props);
  },

  componentWillUnmount: function() {
    TripStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function(nextProps) {
    this.getDataIfNeeded(nextProps);
  },

  getDataIfNeeded: function(props) {
    var currentTripId = TripStore.getCurrentTripId();
    if (props && props.params && props.params.tripId) {
      if (props.params.tripId !== currentTripId) {
        TripAction.setCurrentTrip(props.params.tripId);
      }
    } else {
      TripAction.setCurrentTrip(null);
      // if we don't have props or params or tripId, need default
      // TripAction.initialLoadTrip();
    }
  },

  render: function() {
    var parCount = 0;
    var tripId = this.state.tripId;

    if (tripId) {
      var parList = utils.splitText(this.state.description);
      var paragraphs = parList.map(function(par) {
        parCount++;
        return utils.buildTextNode('p', 'text', 'p-' + parCount, par);
      });
      return (
        <div className="trip">
          {paragraphs}
          {_startReadingLink(tripId, this.state.firstJournalId)}
          <h3>Post List</h3>
          <p>Use the list below to jump to a specific day in the trip and start
            reading.</p>
          <TripJournalList tripId={tripId} />
        </div>
      );
    }
    return <div>nothing here</div>;
  }
});

module.exports = TripDescription;
