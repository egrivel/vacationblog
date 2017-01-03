'use strict';

const React = require('react');

const JournalStore = require('../stores/JournalStore');
const TripStore = require('../stores/TripStore');
const JournalAction = require('../actions/JournalAction');
const TripAction = require('../actions/TripAction');
const JournalEntry = require('./JournalEntry.jsx');
const utils = require('../utils');

/**
 * Journal wrapper component. This component wraps a journal entry and
 * provides for loading of the data.
 *
 * The journal wrapper does not participate in the Flux cycle. Instead,
 * it is responsible for making sure that all the data needed to display
 * a journal entry is loaded and available to the JournalEntry component
 * to display.
 */

const JournalWrapper = React.createClass({
  displayName: 'JournalWrapper',

  propTypes: {
    params: React.PropTypes.object,
    history: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    })
  },

  /**
   * React lifecycle function. Called when the component is first
   * mounted. Not called on updates; the componentWillReceiveProps is
   * called on updates.
   */
  componentDidMount: function() {
    this.getDataIfNeeded(this.props);

    let cookieValue = '';
    if (this.props.params.tripId) {
      cookieValue += 'journal/' + this.props.params.tripId;
    }
    if (this.props.params.journalId) {
      cookieValue += '/' + this.props.params.journalId;
    }
    utils.setCookie(utils.cookies.ENTRY, cookieValue, 1000);
  },

  /**
   * React lifecycle function. Called when the components is already
   * mounted and there are new props passed in.
   * @param {object} nextProps - new properties that are passed to this
   * component as part of the update.
   */
  componentWillReceiveProps: function(nextProps) {
    this.getDataIfNeeded(nextProps);

    let cookieValue = '';
    if (this.props.params.tripId) {
      cookieValue += 'journal/' + this.props.params.tripId;
    }
    if (this.props.params.journalId) {
      cookieValue += '/' + this.props.params.journalId;
    }
    utils.setCookie(utils.cookies.ENTRY, cookieValue, 1000);
  },

  /*
   * Determine if new data needs to be loaded.
   * @param {object} props - props to use in the comparison.
   */
  getDataIfNeeded: function(props) {
    const data = JournalStore.getData();
    let tripId = '';
    let journalId = '';

    if (props && props.params) {
      tripId = props.params.tripId;
      journalId = props.params.journalId;
      if ((tripId !== data.tripId) ||
          (journalId !== data.journalId)) {
        // loading the journal will also load comments, media, and all
        // associated user information.
        JournalAction.loadJournal(tripId, journalId);
      }
      const userList = TripStore.getTripUsers(tripId);
      if (!userList || !userList.length) {
        TripAction.loadTripUsers(tripId);
      }
    }
  },

  /**
   * React lifecyle function. Render the component.
   * @return {React} JournalEntry element.
   */
  render: function() {
    let tripId;
    let journalId;
    let dispMap = false;

    if (this.props && this.props.params) {
      if (this.props.params.tripId) {
        tripId = this.props.params.tripId;
      }
      if (this.props.params.journalId) {
        journalId = this.props.params.journalId;
      }
      if (this.props.params.map) {
        dispMap = true;
      }
    }
    return (
      <JournalEntry
        tripId={tripId}
        journalId={journalId}
        history={this.props.history}
        dispMap={dispMap}
      >
      </JournalEntry>
    );
  }
});

module.exports = JournalWrapper;
