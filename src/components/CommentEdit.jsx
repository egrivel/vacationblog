'use strict';

var React = require('react');

var CommentAction = require('../actions/CommentAction');
var CommentStore = require('../stores/CommentStore');
var storeMixin = require('./StoreMixin');

var CommentEdit = React.createClass({
  displayName: 'CommentEdit',

  mixins: [storeMixin()],

  stores: [CommentStore],

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    referenceId: React.PropTypes.string.isRequired,
    commentId: React.PropTypes.string
  },

  _getStateFromStores: function() {
    var value = CommentStore.getCommentText(this.props.tripId,
      this.props.referenceId, this.props.commentId);
    if (value) {
      value = value.replace(/&lf;/g, "\n\n");
    }
    return {
      value: value
    };
  },

  _stopEditing: function(event) {
    var value = this.state.value;
    value = value.replace(/[\r\n]+/g, '&lf;');
    CommentAction.setEditing(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      false);
    if (this.props.commentId) {
      CommentAction.setCommentText(this.props.tripId,
        this.props.referenceId, this.props.commentId,
        value);
    } else {
      CommentAction.setCommentText(this.props.tripId,
        this.props.referenceId, this.props.commentId,
        '');
    }
    // re-load data from server, since we cancelled
    CommentAction.recursivelyLoadComments(this.props.tripId,
      this.props.referenceId);
    event.preventDefault();
    event.stopPropagation();
  },

  _updateValue: function(event) {
    var value = '';
    if (event && event.target) {
      value = event.target.value;
    }
    CommentAction.setCommentText(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      value);
    event.preventDefault();
    event.stopPropagation();
  },

  _doPost: function() {
    var value = this.state.value;
    value = value.replace(/[\r\n]+/g, '&lf;');
    CommentAction.setEditing(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      false);
    if (this.props.commentId) {
      CommentAction.setCommentText(this.props.tripId,
        this.props.referenceId, this.props.commentId,
        value);
    } else {
      CommentAction.setCommentText(this.props.tripId,
        this.props.referenceId, this.props.commentId,
        '');
    }
    CommentAction.postComment(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      value);
  },

  render: function() {
    return (
      <div className="commentEdit">
        Comment:
        <textarea autoFocus className="comment" defaultValue={this.state.value}
          ref="editbox" onBlur={this._updateValue}/>
        <button onClick={this._doPost}>Post</button>
        <button onClick={this._stopEditing}>Cancel</button>
      </div>
    );
  }
});

module.exports = CommentEdit;