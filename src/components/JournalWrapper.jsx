'use strict';

var React = require('react');
var JournalEntry = require('./JournalEntry');

var JournalStore = require('../stores/JournalStore');
var JournalAction = require('../actions/JournalAction');

/**
 * Journal wrapper component. This component wraps a journal entry and
 * provides for loading of the data.
 *
 * The journal wrapper does not participate in the Flux cycle. Instead,
 * it is responsible for making sure that all the data needed to display
 * a journal entry is loaded and available to the JournalEntry component
 * to display.
 */

var JournalWrapper = React.createClass({
  displayName: 'JournalWrapper',

  /**
   * React lifecycle function. Called when the component is first
   * mounted. Not called on updates; the componentWillReceiveProps is
   * called on updates.
   */
  componentDidMount: function() {
    this.getDataIfNeeded(this.props);
  },

  /**
   * React lifecycle function. Called when the components is already
   * mounted and there are new props passed in.
   * @param {object} nextProps - new properties that are passed to this
   * component as part of the update.
   */
  componentWillReceiveProps: function(nextProps) {
    this.getDataIfNeeded(nextProps);
  },

  /**
   * Determine if new data needs to be loaded.
   * @param {object} props - props to use in the comparison.
   */
  getDataIfNeeded(props) {
    var data = JournalStore.getData();
    var tripId = '';
    var journalId = '';
    if (props && props.params) {
      tripId = props.params.tripId;
      journalId = props.params.journalId;
    }
    if ((tripId !== data.tripId) ||
        (journalId !== data.journalId)) {
      JournalAction.loadJournal(tripId, journalId);
    }
  },

  /**
   * React lifecyle function. Render the component.
   * @return {React} JournalEntry element.
   */
  render: function() {
    return <JournalEntry params={this.props.params} />;
  }
});

module.exports = JournalWrapper;
