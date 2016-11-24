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

var TripStore = require('../stores/TripStore');
var JournalStore = require('../stores/JournalStore');
var UserStore = require('../stores/UserStore');
var CommentStore = require('../stores/CommentStore');
var MediaStore = require('../stores/MediaStore');
var storeMixin = require('./StoreMixin');

var CommentAction = require('../actions/CommentAction');

var JournalParagraph = require('./JournalParagraph.jsx');
var CommentList = require('./CommentList.jsx');
var CommentEdit = require('./CommentEdit.jsx');
var Feedback = require('./Feedback.jsx');
var JournalHeader = require('./JournalHeader.jsx');
var JournalPrevNext = require('./JournalPrevNext.jsx');
var utils = require('./utils');

var JournalEntry = React.createClass({
  displayName: 'JournalEntry',

  stores: [TripStore, JournalStore, UserStore, CommentStore, MediaStore],

  mixins: [storeMixin()],

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    journalId: React.PropTypes.string.isRequired
  },

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
    var tripData = TripStore.getTripData(this.props.tripId);
    var journalData = JournalStore.getData();
    var userName = '';
    var comments = null;
    var canAddComment = UserStore.canAddComment();
    var isLoggedIn = UserStore.isUserLoggedIn();
    var loggedInUserId = UserStore.getLoggedInUser();
    var profileImg = null;
    var tripActive = 'Y';

    if (!tripData || !tripData.active || (tripData.active !== 'Y')) {
      tripActive = 'N';
      canAddComment = false;
    }

    if (!journalData || !journalData.tripId || !journalData.journalId ||
      (this.props.tripId !== journalData.tripId) ||
      (this.props.journalId !== journalData.journalId)) {
      // There is no actual journal item. Clear out the state.
      return {
        tripId: null,
        tripActive: tripActive,
        journalId: null,
        journalTitle: 'Not Found',
        journalText: 'The requested journal item was not found.',
        journalDate: null,
        created: null,
        userName: null,
        nextId: null,
        prevId: null,
        comments: null,
        canAddComment: canAddComment,
        loggedInUserId: loggedInUserId,
        isLoggedIn: isLoggedIn,
        profileImg: profileImg
      };
    }

    if (journalData.userId) {
      var userData = UserStore.getData(journalData.userId);
      if (userData) {
        userName = userData.name;
      } else {
        // If no user name can be retrieved, default to the user ID.
        userName = journalData.userId;
      }
    }

    comments = CommentStore.getRecursiveList(journalData.tripId,
                                             journalData.journalId);
    var userList = TripStore.getTripUsers(journalData.tripId);
    if (userList) {
      for (let i = 0; i < userList.length; i++) {
        const item = userList[i];
        if (item.userId === journalData.userId) {
          profileImg = item.profileImg;
        }
      }
    }

    return {
      tripId: journalData.tripId,
      tripActive: tripActive,
      journalId: journalData.journalId,
      journalTitle: journalData.journalTitle,
      journalText: journalData.journalText,
      journalDate: journalData.journalDate,
      created: journalData.created,
      userName: userName,
      nextId: journalData.nextId,
      prevId: journalData.prevId,
      comments: comments,
      canAddComment: canAddComment,
      loggedInUserId: loggedInUserId,
      isLoggedIn: isLoggedIn,
      profileImg: profileImg
    };
  },

  _startEditing: function(event) {
    var tripId = event.target.getAttribute('data-trip-id');
    var referenceId = event.target.getAttribute('data-reference-id');
    var commentId = event.target.getAttribute('data-comment-id');
    CommentAction.setEditing(tripId, referenceId, commentId, true);
    event.preventDefault();
    event.stopPropagation();
  },

  render: function render() {
    var nr = 0;
    var tripId = this.state.tripId;
    var journalId = this.state.journalId;
    var loggedInUserId = this.state.loggedInUserId;

    var parList = utils.splitText(this.state.journalText);

    var paragraphs = null;
    if (tripId && journalId) {
      paragraphs = parList.map(function(par) {
        nr++;
        var key = 'p-' + nr;
        return (
          <JournalParagraph tripId={tripId} key={key} text={par}/>
        );
      });
    }
    var comments = null;
    if (tripId && journalId) {
      comments = (
        <CommentList
          tripId={tripId}
          tripActive={this.state.tripActive}
          referenceId={journalId}
          comments={this.state.comments}
          loggedInUserId={loggedInUserId}
        />
      );
    }

    var feedback = null;
    if (tripId && journalId) {
      feedback = React.createElement(Feedback, {
        tripId: tripId,
        referenceId: journalId,
        key: tripId + ':' + journalId
      });
    }

    var prevNext1 = null;
    var prevNext2 = null;
    if (tripId) {
      prevNext1 = (
        <JournalPrevNext tripId={tripId}
          prevId={this.state.prevId}
          nextId={this.state.nextId}
          nr={1}/>
      );
      prevNext2 = (
        <JournalPrevNext tripId={tripId}
          prevId={this.state.prevId}
          nextId={this.state.nextId}
          nr={2}/>
      );
    }

    var newComment = null;
    if (this.state.canAddComment && tripId && journalId) {
      if (CommentStore.isEditing(tripId, journalId)) {
        newComment = (
          <CommentEdit tripId={tripId} referenceId={journalId}
            key={tripId + '-' + journalId}/>
        );
      } else {
        newComment = (
          <div className="commentEdit">
            <a href="#" onClick={this._startEditing} className="addComment"
              data-trip-id={tripId} data-reference-id={journalId}>
              Add a comment
            </a>
          </div>
        );
      }
    } else if (!this.state.isLoggedIn) {
      newComment = (
        <div className="commentAdd">Please login to comment.</div>
      );
    }

    const backLink = (
      <div className="backlink">
        <a href={'#/trip/' + tripId}>
          <i className="fa fa-arrow-left"></i> Back to trip
        </a>
      </div>
    );

    return (
      <div className="journalitem">
        {backLink}
        <JournalHeader title={this.state.journalTitle}
          date={this.state.journalDate}
          userName={this.state.userName}
          created={this.state.created}
          profileImg={this.state.profileImg}/>
        {prevNext1}
        {paragraphs}
        {newComment}
        {feedback}
        {comments}
        {prevNext2}
      </div>
    );
  }
});

module.exports = JournalEntry;
