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
      tripId: React.PropTypes.string.isRequired,
      journalId: React.PropTypes.string.isRequired
    }),
    history: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    })
  },

  componentDidMount: function() {
    const tripId = this.props.params.tripId;
    const journalId = this.props.params.journalId;

    if (journalId === '_new') {
      JournalAction.clearJournal(tripId, journalId);
    } else {
      JournalAction.loadJournal(tripId, journalId);
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
  // Button functions
  // ---

  _save: function() {
    const tripId = this.props.params.tripId;
    const journalId = this.props.params.journalId;
    const journalData = this.state.journalData;

    let text = journalData.journalText;
    text = String(text).replace(/\n\n+/g, '&lf;');
    text = text.replace(/\n+/g, ' ');
    text = text.replace(/\[([\d\-abcde]+)\]/g, '[IMG $1]');
    journalData.journalText = text;

    if (journalId === '_new') {
      JournalAction.createJournal(tripId, journalData);
      this.props.history.push('/trip/' + tripId);
    } else {
      JournalAction.updateJournal(tripId, journalId, journalData);
      this.props.history.push('/journal/' + tripId + '/' + journalId);
    }
  },

  _cancel: function() {
    const tripId = this.props.params.tripId;
    const journalId = this.props.params.journalId;

    if (journalId === '_new') {
      // clear the edited data
      JournalAction.clearJournal(tripId, journalId);
      this.props.history.push('/trip/' + tripId);
    } else {
      // re-load the original content of the journal entry
      JournalAction.loadJournal(tripId, journalId);
      this.props.history.push('/journal/' + tripId + '/' + journalId);
    }
  },

  // ---
  // Render Functions
  // ---

  _renderTitle: function() {
    const title = _.get(this.state.journalData, 'journalTitle', '');

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
    const date = _.get(this.state.journalData, 'journalDate', '');

    const result = [];
    result.push(
      <div
        key="date-label"
        className="formLabel"
      >
        Date
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
    let text = _.get(this.state.journalData, 'journalText', '');
    if (text) {
      text = String(text).replace(/&lf;/g, '\n\n');
      text = text.replace(/\[IMG ([\w\-]+)\]/g, '[$1]');
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

  _renderButtons: function() {
    const result = [];

    result.push(
      <div
        key="buttons-label"
        className="formLabel"
      >
      </div>
    );

    result.push(
      <div
        key="buttons-value"
        className="formValue"
      >
        <button onClick={this._save}>Save</button>
        {' '}
        <button onClick={this._cancel}>Cancel</button>
      </div>
    );

    return result;
  },

  render: function() {
    const journalData = this.state.journalData;
    let itemTitle = '(untitled)';
    let itemDate = '(without a date)';

    if (journalData && journalData.journalTitle) {
      itemTitle = journalData.journalTitle;
    }
    if (journalData && journalData.journalDate) {
      itemDate = journalData.journalDate;
    }
    return (
      <div>
        <p>
          Edit blog post <em>{itemTitle}</em> dated {itemDate}.
        </p>
        <p>
          To include photos in this post, put the photo ID in square brackets,
          e.g. [20160101-101112]. Additional formatting: use [EM]..[/EM] for
          emphasis (italics). Insert a link by using the [LINK (target)]
          label [/LINK] construct.
        </p>
        {this._renderTitle()}
        {this._renderDate()}
        {this._renderText()}
        {this._renderButtons()}
      </div>
    );
  }
});

module.exports = JournalEdit;
