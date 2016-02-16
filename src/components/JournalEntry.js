'use strict';

/**
 * Display an entire journal entry.
 *
 * This is the major entry point to display the journal entry, which
 * in turn is the backbone of the vacation blog website.
 *
 * The journal entry is the component that participates in the flux
 * cycle. It will retrieve all the information needed to display the
 * content, and pass them on as props to the various child components.
 *
 * This component does not load data, it only displays data that has
 * already been loaded. Loading data happens in the JournalWrapper
 * component.
 */

// Add 'window' to the eslint globals for this file.
/* global window */

var React = require('react');

var JournalStore = require('../stores/JournalStore');
var MediaStore = require('../stores/MediaStore');
var UserStore = require('../stores/UserStore');
var CommentStore = require('../stores/CommentStore');
var storeMixin = require('./StoreMixin');

var Paragraph = require('./Paragraph');
var CommentList = require('./CommentList');
var Feedback = require('./Feedback');
var JournalEntryHeader = require('./JournalEntryHeader.jsx');
var JournalEntryPrevNext = require('./JournalEntryPrevNext.jsx');
var utils = require('./utils');

var JournalEntry = React.createClass({
  displayName: 'JournalEntry',

  stores: [JournalStore, MediaStore, UserStore, CommentStore],

  mixins: [storeMixin()],

  /**
   * React lifecycle function. Called when the components is already
   * mounted and there are new props passed in.
   * @param {object} nextProps - new properties that are passed to this
   * component as part of the update.
   */
  // standard lifecyle parameter is not used - this is not a problem
  /* eslint-disable no-unused-vars */
  componentWillReceiveProps: function(nextProps) {
    // When the page is loaded with new parameters (i.e. a new journal
    // entry is displayed), scroll to the top of the page.
    window.scrollTo(0, 0);
  },
  /* eslint-enable no-unused-vars */

  /**
   * Get the state from the stores.
   * @return {object} new state.
   * @private
   */
  _getStateFromStores: function() {
    var journalData = JournalStore.getData();
    var userName = '';
    var comments = null;

    if (!journalData || !journalData.tripId) {
      // There is no actual journal item. Clear out the state.
      return {
        tripId: null,
        journalId: null,
        journalTitle: 'Not Found',
        journalText: 'The requested journal item was not found.',
        journalDate: null,
        created: null,
        userName: null,
        nextId: null,
        prevId: null,
        comments: null
      };
    }

    if (journalData && journalData.userId) {
      var userData = UserStore.getData(journalData.userId);
      if (userData) {
        userName = userData.name;
      } else {
        // If no user name can be retrieved, default to the user ID.
        userName = journalData.userId;
      }
    }

    if (journalData.tripId && journalData.journalId) {
      comments = CommentStore.getRecursiveData(journalData.tripId,
                                               journalData.journalId);
    }

    return {
      tripId: journalData.tripId,
      journalId: journalData.journalId,
      journalTitle: journalData.journalTitle,
      journalText: journalData.journalText,
      journalDate: journalData.journalDate,
      created: journalData.created,
      userName: userName,
      nextId: journalData.nextId,
      prevId: journalData.prevId,
      comments: comments
    };
  },

  render: function render() {
    var parCount = 0;
    var tripId = this.state.tripId;
    var journalId = this.state.journalId;

    var parList = utils.splitText(this.state.journalText);

    var comment = null;
    if (tripId && journalId) {
      comment = React.createElement(CommentList, {
        tripId: this.state.tripId,
        referenceId: this.state.journalId,
        comments: this.state.comments
      });
    }

    var feedback = null;
    if (tripId && journalId) {
      feedback = React.createElement(Feedback, null);
    }

    return React.DOM.div(
      {
        className: 'journalitem'
      },
      React.createElement(
        JournalEntryHeader,
        {
          title: this.state.journalTitle,
          date: this.state.journalDate,
          userName: this.state.userName,
          created: this.state.created
        }
      ),
      React.createElement(JournalEntryPrevNext,
        {
          tripId: tripId,
          prevId: this.state.prevId,
          nextId: this.state.nextId,
          nr: 1
        }
      ),
      parList.map(function(par) {
        parCount++;
        var parKey = 'p-' + parCount;
        return React.createElement(Paragraph, {
          tripId: tripId,
          key: parKey,
          text: par
        });
      }),
      feedback,
      comment,
      React.createElement(JournalEntryPrevNext,
        {
          tripId: tripId,
          prevId: this.state.prevId,
          nextId: this.state.nextId,
          nr: 2
        }
      )
    );
  }
});

module.exports = JournalEntry;
