'use strict';

const _ = require('lodash');
const React = require('react');

const Textbox = require('./standard/Textbox.jsx');
const Textarea = require('./standard/Textarea.jsx');
const ButtonBar = require('./standard/ButtonBar.jsx');

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

  _updateTitle: function(value) {
    const journalData = _.clone(this.state.journalData);
    journalData.journalTitle = value;
    JournalAction.updateEditJournal(journalData);
  },

  _updateDate: function(value) {
    const journalData = _.clone(this.state.journalData);
    journalData.journalDate = value;
    JournalAction.updateEditJournal(journalData);
  },

  _updateText: function(value) {
    const journalData = _.clone(this.state.journalData);
    journalData.journalText = value;
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

    return (
      <Textbox
        fieldId="title"
        label="Title"
        value={title}
        onBlur={this._updateTitle}
      />
    );
  },

  _renderDate: function() {
    const date = _.get(this.state.journalData, 'journalDate', '');

    return (
      <Textbox
        fieldId="date"
        label="Date"
        value={date}
        onBlur={this._updateDate}
      />
    );
  },

  _renderText: function() {
    let text = _.get(this.state.journalData, 'journalText', '');
    if (text) {
      text = String(text).replace(/&lf;/g, '\n\n');
      text = text.replace(/\[IMG ([\w\-]+)\]/g, '[$1]');
    }

    return (
      <Textarea
        fieldId="text"
        label="Text"
        value={text}
        onBlur={this._updateText}
      />
    );
  },

  _renderButtons: function() {
    const buttons = [];
    buttons.push({
      label: 'Save',
      onClick: this._save
    });
    buttons.push({
      label: 'Cancel',
      onClick: this._cancel
    });

    return (
      <ButtonBar
        buttons={buttons}
      />
    );
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
        <p>Special formatting options:</p>
        <ul>
          <li>To include a panoramic image (full width of the display), use
            the [PANO {'<imageid>'}] structure. Optionally, an offset (ranging
            from -50 to +50) can be given. An offset of -50 will bottom-align
            the panoramic image, +50 will top-align it. Default is 0 for
            centering the image vertically.</li>
        </ul>
      </div>
    );
  }
});

module.exports = JournalEdit;
