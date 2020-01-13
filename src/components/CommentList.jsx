/**
 * Display one or more comments to a given item. This component will
 * call itself recursively to display comments to comments.
 */

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import UserStore from '../stores/UserStore';
import CommentStore from '../stores/CommentStore';
import CommentAction from '../actions/CommentAction';

import utils from './utils';
import Feedback from './Feedback';
import CommentEdit from './CommentEdit';

// Declare variables that will be used later
let CommentList = null;

const CommentParagraph = createReactClass({
  displayName: 'CommentParagraph',

  propTypes: {
    text: PropTypes.string.isRequired,
    parKey: PropTypes.string
  },

  render: function() {
    let text = utils.replaceEntities(this.props.text);

    text = text.replace(/\s\s+/g, ' ');

    if ((text === '') || (text === ' ')) {
      // no text left
      return null;
    }

    return utils.buildTextNode('p', 'text', this.props.parKey, text);
  }
});

const Comment = createReactClass({
  displayName: 'Comment',

  propTypes: {
    tripId: PropTypes.string.isRequired,
    tripActive: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
    commentId: PropTypes.string,
    created: PropTypes.string,
    commentText: PropTypes.string,
    deleted: PropTypes.string,
    userId: PropTypes.string,
    userName: PropTypes.string,
    comments: PropTypes.array,
    loggedInUserId: PropTypes.string
  },

  _startEditing: function(event) {
    const tripId = event.target.getAttribute('data-trip-id');
    const referenceId = event.target.getAttribute('data-reference-id');
    const commentId = event.target.getAttribute('data-comment-id');
    CommentAction.setEditing(tripId, referenceId, commentId, true);
    event.preventDefault();
    event.stopPropagation();
  },

  // eslint-disable-next-line complexity
  render: function render() {
    const tripId = this.props.tripId;
    const tripActive = this.props.tripActive;
    const referenceId = this.props.referenceId;
    const commentId = this.props.commentId;
    const created = this.props.created;
    const commentText = this.props.commentText;
    const deleted = this.props.deleted;
    const userId = this.props.userId;
    let userName = this.props.userName;
    const comments = this.props.comments;

    // if this comment was deleted, ignore it
    if (deleted === 'Y') {
      return null;
    }

    if (!userName) {
      userName = userId;
    }
    if (!userName) {
      userName = '(unknown)';
    }

    // Note: both the CommentEdit and Feedback elements are controller-views
    // and may result in too many event listners being added.
    let newComment = null;
    if (tripId && (tripActive === 'Y') &&
      commentId && this.props.loggedInUserId) {
      if (CommentStore.isEditing(tripId, commentId)) {
        newComment = React.createElement(
          CommentEdit,
          {
            tripId: tripId,
            referenceId: commentId,
            key: 'c-' + tripId + '-' + commentId
          }
        );
      } else {
        newComment = (
          <div className="commentEdit">
            <a
              href="#"
              onClick={this._startEditing}
              className="addComment"
              data-trip-id={tripId}
              data-reference-id={commentId}
            >
              Add a comment
            </a>
          </div>
        );
      }
    }

    let feedback = null;
    feedback = React.createElement(Feedback, {
      tripId: tripId,
      referenceId: commentId,
      key: tripId + ':' + commentId
    });

    let commentEdit = null;
    if ((tripActive === 'Y') &&
      CommentStore.canEditComment(commentId, this.props.loggedInUserId)) {
      if (!CommentStore.isEditing('', '', commentId)) {
        commentEdit = (
          <div className="commentEdit">
            <button
              onClick={this._startEditing}
              className="addComment"
              data-trip-id={tripId}
              data-comment-id={commentId}
            >
              Edit
            </button>
          </div>
        );
      }
    }

    const header = (
      <h3>
        <em>by </em>
        <strong>{userName} </strong>
        <span>on </span>
        {utils.formatDate(created)}
        <span className="commentId">{commentEdit}</span>
      </h3>
    );

    const parList = utils.splitText(commentText);

    let parCount = 0;

    const list = React.createElement(
      CommentList,
      {
        tripId: tripId,
        tripActive: tripActive,
        referenceId: commentId,
        comments: comments,
        loggedInUserId: this.props.loggedInUserId
      });

    let commentBody = '';
    if (CommentStore.isEditing('', '', commentId)) {
      commentBody = (
        <CommentEdit
          tripId={tripId}
          commentId={commentId}
          referenceId={referenceId}
          key={'c-' + tripId + '-' + commentId}
        />
      );
    } else {
      commentBody = parList.map((par) => {
        parCount++;
        const parKey = 'p-' + parCount;
        return React.createElement(CommentParagraph, {
          tripId: tripId,
          key: parKey,
          parKey: parKey,
          text: par
        });
      });
    }

    return (
      <div className="commentBlock">
        {header}
        {commentBody}
        {newComment}
        {feedback}
        {list}
      </div>
    );

    // return React.DOM.div(
    //   {
    //     className: 'commentBlock'
    //   },
    //   header,
    //   commentBody,
    //   newComment,
    //   feedback,
    //   list);
  }
});

CommentList = createReactClass({
  displayName: 'CommentList',

  propTypes: {
    comments: PropTypes.array.isRequired,
    tripId: PropTypes.string.isRequired,
    tripActive: PropTypes.string.isRequired,
    referenceId: PropTypes.string,
    loggedInUserId: PropTypes.string
  },

  render: function() {
    if (!this.props.comments || !this.props.comments.length) {
      return null;
    }

    const commentList = [];
    let count = 0;
    for (let i = 0; i < this.props.comments.length; i++) {
      const userId = this.props.comments[i].userId;
      const userData = UserStore.getData(userId);
      let userName = '';
      if (userData) {
        userName = userData.name;
      }
      const canEdit = (this.props.tripActive === 'Y') &&
        (userId === this.props.loggedInUserId);
      commentList[count++] = React.createElement(
        Comment,
        {
          tripId: this.props.comments[i].tripId,
          tripActive: this.props.tripActive,
          referenceId: this.props.comments[i].referenceId,
          commentId: this.props.comments[i].commentId,
          userId: userId,
          userName: userName,
          created: this.props.comments[i].created,
          commentText: this.props.comments[i].commentText,
          deleted: this.props.comments[i].deleted,
          comments: this.props.comments[i].childComments,
          key: this.props.comments[i].commentId,
          loggedInUserId: this.props.loggedInUserId,
          canEdit: canEdit
        }
      );
    }
    return (
      <div
        className="comments"
        key={'comment-list-' + this.props.referenceId}
      >
        {commentList}
      </div>
    );
    // return React.DOM.div(
    //   {
    //     className: 'comments',
    //     key: 'comment-list-' + this.props.referenceId
    //   },
    //   commentList
    // );
  }
});

export default CommentList;
