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

const React = require('react');

const TripStore = require('../stores/TripStore');
const JournalStore = require('../stores/JournalStore');
const UserStore = require('../stores/UserStore');
const CommentStore = require('../stores/CommentStore');
const MediaStore = require('../stores/MediaStore');
const storeMixin = require('./StoreMixin');
const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const CommentAction = require('../actions/CommentAction');

const JournalParagraph = require('./JournalParagraph.jsx');
const CommentList = require('./CommentList.jsx');
const CommentEdit = require('./CommentEdit.jsx');
const Feedback = require('./Feedback.jsx');
const JournalHeader = require('./JournalHeader.jsx');
const JournalPrevNext = require('./JournalPrevNext.jsx');
const utils = require('./utils');

const JournalEntry = React.createClass({
  displayName: 'JournalEntry',

  stores: [TripStore, JournalStore, UserStore, CommentStore, MediaStore],

  mixins: [storeMixin()],

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    journalId: React.PropTypes.string.isRequired,
    history: React.PropTypes.shape({
      push: React.PropTypes.func.isRequired
    })
  },

  contextTypes: {
    router: React.PropTypes.object.isRequired
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

  componentDidMount: function() {
    MenuAction.selectItem(MenuStore.menuIds.HOME);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.HOME);
  },

  /**
   * Get the state from the stores.
   * @return {object} new state.
   * @private
   */
  _getStateFromStores: function() {
    const tripData = TripStore.getTripData(this.props.tripId);
    const journalData = JournalStore.getData();
    const isLoggedIn = UserStore.isUserLoggedIn();
    const loggedInUserId = UserStore.getLoggedInUser();

    let userName = '';
    let comments = null;
    let canAddComment = UserStore.canAddComment();
    let profileImg = null;
    let tripActive = 'Y';

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
        journalUserId: null,
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
      const userData = UserStore.getData(journalData.userId);
      if (userData) {
        userName = userData.name;
      } else {
        // If no user name can be retrieved, default to the user ID.
        userName = journalData.userId;
      }
    }

    comments = CommentStore.getRecursiveList(journalData.tripId,
                                             journalData.journalId);
    const userList = TripStore.getTripUsers(journalData.tripId);
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
      journalUserId: journalData.userId,
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
    const tripId = event.target.getAttribute('data-trip-id');
    const referenceId = event.target.getAttribute('data-reference-id');
    const commentId = event.target.getAttribute('data-comment-id');
    CommentAction.setEditing(tripId, referenceId, commentId, true);
    event.preventDefault();
    event.stopPropagation();
  },

  _editCallback: function() {
    const editLink = '/journalEdit/' + this.state.tripId +
      '/' + this.state.journalId;
    this.context.router.push(editLink);
  },

  render: function render() {
    let nr = 0;
    const tripId = this.state.tripId;
    const journalId = this.state.journalId;
    const loggedInUserId = this.state.loggedInUserId;

    const parList = utils.splitText(this.state.journalText);
    let paragraphs = null;
    if (tripId && journalId) {
      paragraphs = [];
      for (let i = 0; i < parList.length; i++) {
        const par = parList[i];
        nr++;
        const key = 'p-' + nr;
        paragraphs.push(
          <JournalParagraph
            tripId={tripId}
            tripActive={this.state.tripActive}
            key={key}
            text={par}
          />
        );
      }
    }

    let editCallback = null;
    if (this.state.tripActive &&
      (this.state.tripActive === 'Y') &&
      (loggedInUserId === this.state.journalUserId)) {
      editCallback = this._editCallback;
    }

    let comments = null;
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

    let feedback = null;
    if (tripId && journalId) {
      feedback = React.createElement(Feedback, {
        tripId: tripId,
        referenceId: journalId,
        key: tripId + ':' + journalId
      });
    }

    let prevNext1 = null;
    let prevNext2 = null;
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

    let newComment = null;
    if (this.state.tripActive === 'Y') {
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
        <JournalHeader
          title={this.state.journalTitle}
          editCallback={editCallback}
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
