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

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import {Link} from 'react-router';

import TripStore from '../stores/TripStore';
import JournalStore from '../stores/JournalStore';
import UserStore from '../stores/UserStore';
import CommentStore from '../stores/CommentStore';
import MediaStore from '../stores/MediaStore';
import storeMixin from './StoreMixin';
import MenuAction from '../actions/MenuAction';
import MenuStore from '../stores/MenuStore';

import CommentAction from '../actions/CommentAction';

import JournalParagraph from './JournalParagraph.jsx';
import CommentList from './CommentList.jsx';
import CommentEdit from './CommentEdit.jsx';
import Feedback from './Feedback.jsx';
import JournalHeader from './JournalHeader.jsx';
import JournalPrevNext from './JournalPrevNext.jsx';
import utils from './utils';

const JournalEntry = createReactClass({
  displayName: 'JournalEntry',

  stores: [TripStore, JournalStore, UserStore, CommentStore, MediaStore],

  mixins: [storeMixin()],

  propTypes: {
    tripId: PropTypes.string.isRequired,
    journalId: PropTypes.string.isRequired,
    dispMap: PropTypes.bool,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  },

  contextTypes: {
    router: PropTypes.object.isRequired
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
    MenuAction.selectItem(MenuStore.menuIds.TRIP);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.TRIP);
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
        journalTitle: 'Loading',
        journalText: 'Loading the information...',
        journalDate: null,
        created: null,
        userName: null,
        nextId: null,
        prevId: null,
        comments: null,
        canAddComment: canAddComment,
        loggedInUserId: loggedInUserId,
        isLoggedIn: isLoggedIn,
        profileImg: profileImg,
        map: null
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

    const map = journalData.map;

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
      profileImg: profileImg,
      map: map
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

    let canEdit = false;
    if (this.state.tripActive &&
      (this.state.tripActive === 'Y') &&
      (loggedInUserId === this.state.journalUserId)) {
      canEdit = true;
    }
    // console.log('set canEdit to ' + canEdit + ' with type ' + typeof(canEdit));

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
            canEdit={canEdit}
            key={key}
            text={par}
          />
        );
      }
    }

    const editCallback = canEdit ? this._editCallback : null;

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
          <div className="commentAdd">
            Please login to comment. You can now also login using
            your facebook account.
          </div>
        );
      }
    }

    const backLink = (
      <div className="backlink">
        <Link href={'#/trip/' + tripId}>
          <i className="fa fa-arrow-left"></i> Back to trip
        </Link>
      </div>
    );

    return (
      <div className="journalitem">
        {backLink}
        <JournalHeader
          tripId={this.props.tripId}
          journalId={this.props.journalId}
          title={this.state.journalTitle}
          editCallback={editCallback}
          date={this.state.journalDate}
          userName={this.state.userName}
          created={this.state.created}
          profileImg={this.state.profileImg}
          map={this.state.map}
          dispMap={this.props.dispMap}
        />
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

export default JournalEntry;
