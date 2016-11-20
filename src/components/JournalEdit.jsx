'use strict';

const _ = require('lodash');
const React = require('react');

const storeMixin = require('./StoreMixin');
const TripStore = require('../stores/TripStore');
const JournalStore = require('../stores/JournalStore');

const JournalAction = require('../actions/JournalAction');

const JournalEdit = React.createClass({
  displayName: 'Journal Edit',

  mixins: [storeMixin()],

  stores: [TripStore, JournalStore],

  propTypes: {
    params: React.PropTypes.shape({
      tripId: React.PropTypes.string.required,
      journalId: React.PropTypes.string.required
    })
  },

  componentDidMount: function() {
    const tripId = this.props.params.tripId;
    const journalId = this.props.params.journalId;
    const journalData = JournalStore.getData();
    if ((journalData.tripId !== tripId) ||
      (journalData.journalId !== journalId)) {
      if (journalId === '_new') {
        JournalAction.clearJournal(tripId, journalId);
      } else {
        JournalAction.loadJournal(tripId, journalId);
      }
    }
  },

  _getStateFromStores: function() {
    const journalData = JournalStore.getData();
    return {
      journalData: journalData
    };
  },

  _renderTitle: function(journalData) {
    const title = _.get(journalData, 'journalTitle');

    return <p>Title: {title}</p>;
  },

  _renderDate: function(journalData) {
    const date = _.get(journalData, 'journalDate');

    return <p>Date: {date}</p>;
  },

  _renderText: function(journalData) {
    const text = _.get(journalData, 'journalText');

    return <p>Text: {text}</p>;
  },

  render: function() {
    const journalData = this.state.journalData;
    return (
      <div>
        <p>
          Edit journal trip {this.props.params.tripId}
          {' '} item {this.props.params.journalId}
        </p>
        {this._renderTitle(journalData)}
        {this._renderDate(journalData)}
        {this._renderText(journalData)}
        <p>{JSON.stringify(this.state.journalData)}</p>
      </div>
    );
  }
});

module.exports = JournalEdit;
