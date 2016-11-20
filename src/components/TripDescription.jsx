'use strict';

var React = require('react');
var Link = require('react-router').Link;

var TripAction = require('../actions/TripAction');
var TripStore = require('../stores/TripStore');

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
  const contributorList = TripStore.getTripUsers(tripId);
  return {
    tripId: tripId,
    description: description,
    firstJournalId: firstJournalId,
    contributorList: contributorList
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
      'See the list of days with posts below or ',
      React.createElement(
        Link,
        {
          to: '/journal/' + tripId + '/' + journalId
        },
        'start reading at the beginning ',
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
      const tripUsers = TripStore.getTripUsers(props.params.tripId);
      if (!tripUsers) {
        TripAction.loadTripUsers(props.params.tripId);
      }
    } else {
      TripAction.setCurrentTrip(null);
      // if we don't have props or params or tripId, need default
      // TripAction.initialLoadTrip();
    }
  },

  _renderContributors: function() {
    if (this.state.contributorList) {
      const messages = [];
      let parCount = 0;
      for (let i = 0; i < this.state.contributorList.length; i++) {
        const item = this.state.contributorList[i];
        parCount++;
        let profileImg;
        if (item.profileImg) {
          profileImg = (
            <img
              className="profileImg"
              src={'media/' + item.profileImg}
            />
          );
        }
        messages.push(
          <h3 key={'head-' + parCount}>
            Contributor to this blog: <em>{item.name}</em>
            {profileImg}
          </h3>
        );
        if (item.message) {
          var parList = utils.splitText(item.message);
          for (let j = 0; j < parList.length; j++) {
            parCount++;
            messages.push(utils.buildTextNode('p', 'text noclear',
              'p-' + parCount, parList[j]));
          }
        }
      }
      return messages;
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
          {this._renderContributors()}
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
