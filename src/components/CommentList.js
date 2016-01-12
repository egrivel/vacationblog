'use strict';

/**
 * Display one or more comments to a given item. This component will
 * call itself recursively to display comments to comments.
 */

var React = require('react');

var CommentStore = require('../stores/CommentStore');
var UserStore = require('../stores/UserStore');

var CommentAction = require('../actions/CommentAction');
var UserAction = require('../actions/UserAction');

var utils = require('./utils');
var Feedback = require('./Feedback');
var storeMixin = require('./StoreMixin');

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

    var parList = null;
    if (commentText) {
      parList = commentText.split('&lf;');
    }

    var parCount = 0;

    var list = React.createElement(
      CommentList,
      {
        tripId: tripId,
        referenceId: commentId
      });

    return React.DOM.div(
      {
        className: 'commentBlock'
      },
      header,
      parList.map(function(par) {
        if (par) {
          parCount++;
          var key = tripId + commentId;
          key += '-p' + parCount;
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

  mixins: [storeMixin()],

  stores: [CommentStore, UserStore],

  _recursivelyGetData: function(tripId, commentId) {
    var data = CommentStore.getData(tripId, commentId);
    if (data) {
      for (var i = 0; i < data.count; i++) {
        var userData = UserStore.getData(data.list[i].userId);
        var userName = '';
        if (userData) {
          userName = userData.name;
        } else {
          UserAction.loadUser(data.list[i].userId);
          userName = data.list[i].userId;
        }
        data.list[i].userName = userName;
        data.list[i].subComment = _recursivelyGetData(tripId,
                                                      data.list[i].commentId);
      }
      return data;
    }
  },

  _getStateFromStores: function _getStateFromStores() {
    var commentData = CommentStore.getData(this.props.tripId,
                                           this.props.referenceId);
    if (commentData) {
      for (var i = 0; i < commentData.count; i++) {
        var userData = UserStore.getData(commentData.list[i].userId);

        var userName = '';
        if (userData) {
          userName = userData.name;
        } else {
          UserAction.loadUser(commentData.list[i].userId);
          userName = commentData.list[i].userId;
        }
        commentData.list[i].userName = userName;
      }
      return {
        referenceId: this.props.referenceId,
        count: commentData.count,
        list: commentData.list
      };
    }

    // No data returned; try loading
    CommentAction.loadComments(this.props.tripId, this.props.referenceId);
    return {
      referenceId: this.props.referenceId,
      count: 0
    };
  },

  render: function() {
    if (this.state.count) {
      var commentList = [];
      for (var i = 0; i < this.state.count; i++) {
        commentList[i] = React.createElement(
          Comment,
          {
            tripId: this.props.tripId,
            commentId: this.state.list[i].commentId,
            userId: this.state.list[i].userId,
            userName: this.state.list[i].userName,
            created: this.state.list[i].created,
            commentText: this.state.list[i].commentText,
            deleted: this.state.list[i].deleted,
            key: 'comment-' + this.state.referenceId + '-' + i
          }
        );
      }
      return React.DOM.div(
        {
          className: 'comments',
          key: 'comment-list-' + this.state.referenceId
        },
        commentList);
    }
    return null;
  }
});

module.exports = CommentList;
