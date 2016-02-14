'use strict';

/**
 * Display one or more comments to a given item. This component will
 * call itself recursively to display comments to comments.
 */

var React = require('react');

var UserStore = require('../stores/UserStore');

var UserAction = require('../actions/UserAction');

var utils = require('./utils');
var Feedback = require('./Feedback');

// Declare variables that will be used later
var CommentList;

var CommentParagraph = React.createClass({
  displayName: 'CommentParagraph',

  render: function() {
    if (!this.props.text) {
      return null;
    }

    var text = utils.replaceEntities(this.props.text);

    text = text.replace(/\s\s+/g, ' ');

    if ((text === '') || (text === ' ')) {
      // no text left
      text = null;
    }

    return utils.buildTextNode('p', 'text', this.props.key, text);
  }
});

var Comment = React.createClass({
  displayName: 'Comment',

  render: function render() {
    var tripId = this.props.tripId;
    var commentId = this.props.commentId;
    var created = this.props.created;
    var commentText = this.props.commentText;
    var deleted = this.props.deleted;
    var userName = this.props.userName;
    var comments = this.props.comments;

    var feedback = React.createElement(Feedback, null);

    // if this comment was deleted, ignore it
    if (deleted === 'Y') {
      return null;
    }

    var header = React.DOM.h3(
      null,
      React.DOM.em(null, 'by '),
      React.DOM.strong(null,
                       utils.replaceEntities(userName)),
      ' on ' + utils.formatDate(created),
      React.DOM.span(
        {
          className: 'commentId'
        },
        '[id: ' + commentId + ']'));

    var parList = utils.splitText(commentText);

    var parCount = 0;

    var list = React.createElement(
      CommentList,
      {
        tripId: tripId,
        referenceId: commentId,
        comments: comments
      });

    return React.DOM.div(
      {
        className: 'commentBlock'
      },
      header,
      parList.map(function(par) {
        if (par) {
          parCount++;
          var key = 'p-' + parCount;
          return React.createElement(CommentParagraph, {
            tripId: tripId,
            key: key,
            text: par
          });
        }
        return null;
      }),
      feedback,
      list);
  }
});

CommentList = React.createClass({
  displayName: 'CommentList',

  render: function() {
    if (!this.props.comments || !this.props.comments.count) {
      return null;
    }

    var commentList = [];
    for (var i = 0; i < this.props.comments.count; i++) {
      var userId = this.props.comments.list[i].userId;
      var userData = UserStore.getData(userId);
      var userName = '';
      if (userData) {
        userName = userData.name;
      }
      commentList[i] = React.createElement(
        Comment,
        {
          tripId: this.props.tripId,
          commentId: this.props.comments.list[i].commentId,
          userId: userId,
          userName: userName,
          created: this.props.comments.list[i].created,
          commentText: this.props.comments.list[i].commentText,
          deleted: this.props.comments.list[i].deleted,
          comments: this.props.comments.list[i].comments,
          key: this.props.comments.list[i].commentId
        }
      );
    }
    return React.DOM.div(
      {
        className: 'comments',
        key: 'comment-list-' + this.props.referenceId
      },
      commentList);
  }
});

module.exports = CommentList;
