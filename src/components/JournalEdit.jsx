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

  // ---
  // Update functions
  // ---

  _updateTitle: function(event) {
    const journalData = _.clone(this.state.journalData);
    journalData.journalTitle = event.target.value;
    JournalAction.updateEditJournal(journalData);
  },

  _updateDate: function(event) {
    const journalData = _.clone(this.state.journalData);
    journalData.journalDate = event.target.value;
    JournalAction.updateEditJournal(journalData);
  },

  _updateText: function(event) {
    const journalData = _.clone(this.state.journalData);
    journalData.journalText = event.target.value;
    JournalAction.updateEditJournal(journalData);
  },

  // ---
  // Render Functions
  // ---

  _renderTitle: function() {
    const title = _.get(this.state.journalData, 'journalTitle');

    const result = [];
    result.push(
      <div
        key="title-label"
        className="formLabel"
      >
        Title
      </div>
    );
    result.push(
      <div
        key="title-value"
        className="formValue"
      >
        <input type="text"
          value={title}
          onChange={this._updateTitle}/>
      </div>
    );

    return result;
  },

  _renderDate: function() {
    const date = _.get(this.state.journalData, 'journalDate');

    const result = [];
    result.push(
      <div
        key="date-label"
        className="formLabel"
      >
        Title
      </div>
    );
    result.push(
      <div
        key="date-value"
        className="formValue"
      >
        <input type="text"
          value={date}
          onChange={this._updateDate}/>
      </div>
    );

    return result;
  },

  _renderText: function() {
    let text = _.get(this.state.journalData, 'journalText');
    if (text) {
      text = String(text).replace(/&lf;/g, '\n\n');
    }

    const result = [];
    result.push(
      <div
        key="text-label"
        className="formLabel"
      >
        Text
      </div>
    );
    result.push(
      <div
        key="text-value"
        className="formValue"
      >
        <textarea rows={10} cols={60}
          value={text}
          onChange={this._updateText}
          onBlur={this._saveText}>
        </textarea>
      </div>
    );

    return result;
  },

  render: function() {
    const journalData = this.state.journalData;
    return (
      <div>
        <p>
          Edit journal trip {this.props.params.tripId}
          {' '} item {this.props.params.journalId}
        </p>
        {this._renderTitle()}
        {this._renderDate()}
        {this._renderText()}
        <p>{JSON.stringify(this.state.journalData)}</p>
      </div>
    );
  }
});

module.exports = JournalEdit;
