'use strict';

/**
 * Display one or more comments to a given item. This component will
 * call itself recursively to display comments to comments.
 */

var React = require('react');

var UserStore = require('../stores/UserStore');
var CommentStore = require('../stores/CommentStore');
var CommentAction = require('../actions/CommentAction');

var utils = require('./utils');
var Feedback = require('./Feedback.jsx');
var CommentEdit = require('./CommentEdit.jsx');

// Declare variables that will be used later
var CommentList;

var CommentParagraph = React.createClass({
  displayName: 'CommentParagraph',

  propTypes: {
    text: React.PropTypes.string.isRequired,
    parKey: React.PropTypes.string
  },

  render: function() {
    var text = utils.replaceEntities(this.props.text);

    text = text.replace(/\s\s+/g, ' ');

    if ((text === '') || (text === ' ')) {
      // no text left
      return null;
    }

    return utils.buildTextNode('p', 'text', this.props.parKey, text);
  }
});

var Comment = React.createClass({
  displayName: 'Comment',

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    tripActive: React.PropTypes.string.isRequired,
    referenceId: React.PropTypes.string.isRequired,
    commentId: React.PropTypes.string,
    created: React.PropTypes.string,
    commentText: React.PropTypes.string,
    deleted: React.PropTypes.string,
    userId: React.PropTypes.string,
    userName: React.PropTypes.string,
    comments: React.PropTypes.array,
    loggedInUserId: React.PropTypes.string,
    canEdit: React.PropTypes.bool.isRequired
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
    var tripId = this.props.tripId;
    var tripActive = this.props.tripActive;
    var referenceId = this.props.referenceId;
    var commentId = this.props.commentId;
    var created = this.props.created;
    var commentText = this.props.commentText;
    var deleted = this.props.deleted;
    var userId = this.props.userId;
    var userName = this.props.userName;
    var comments = this.props.comments;

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
    var newComment = null;
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
            <a href="#" onClick={this._startEditing} className="addComment"
              data-trip-id={tripId} data-reference-id={commentId}>
              Add a comment
            </a>
          </div>
        );
      }
    }

    var feedback = null;
    feedback = React.createElement(Feedback, {
      tripId: tripId,
      referenceId: commentId,
      key: tripId + ':' + commentId
    });

    var commentEdit = null;
    if ((tripActive === 'Y') &&
      CommentStore.canEditComment(commentId, this.props.loggedInUserId)) {
      if (!CommentStore.isEditing('', '', commentId)) {
        commentEdit = (
          <div className="commentEdit">
            <button onClick={this._startEditing} className="addComment"
              data-trip-id={tripId} data-comment-id={commentId}>
              Edit
            </button>
          </div>
        );
      }
    }

    var header = (
      <h3>
        <em>by </em>
        <strong>{userName} </strong>
        <span>on </span>
        {utils.formatDate(created)}
        <span className="commentId">{commentEdit}</span>
      </h3>
    );

    var parList = utils.splitText(commentText);

    var parCount = 0;

    var list = React.createElement(
      CommentList,
      {
        tripId: tripId,
        tripActive: tripActive,
        referenceId: commentId,
        comments: comments,
        loggedInUserId: this.props.loggedInUserId
      });

    var commentBody = '';
    if (CommentStore.isEditing('', '', commentId)) {
      commentBody = (
        <CommentEdit tripId={tripId} commentId={commentId}
          referenceId={referenceId} key={'c-' + tripId + '-' + commentId}/>
      );
    } else {
      commentBody = parList.map(function(par) {
        parCount++;
        var parKey = 'p-' + parCount;
        return React.createElement(CommentParagraph, {
          tripId: tripId,
          key: parKey,
          parKey: parKey,
          text: par
        });
      });
    }

    return React.DOM.div(
      {
        className: 'commentBlock'
      },
      header,
      commentBody,
      newComment,
      feedback,
      list);
  }
});

CommentList = React.createClass({
  displayName: 'CommentList',

  propTypes: {
    comments: React.PropTypes.array.isRequired,
    tripId: React.PropTypes.string.isRequired,
    tripActive: React.PropTypes.string.isRequired,
    referenceId: React.PropTypes.string,
    loggedInUserId: React.PropTypes.string
  },

  render: function() {
    if (!this.props.comments || !this.props.comments.length) {
      return null;
    }

    var commentList = [];
    var count = 0;
    for (var i = 0; i < this.props.comments.length; i++) {
      var userId = this.props.comments[i].userId;
      var userData = UserStore.getData(userId);
      var userName = '';
      if (userData) {
        userName = userData.name;
      }
      var canEdit = (this.props.tripActive === 'Y') &&
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
    return React.DOM.div(
      {
        className: 'comments',
        key: 'comment-list-' + this.props.referenceId
      },
      commentList
    );
  }
});

module.exports = CommentList;
