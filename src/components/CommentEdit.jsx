'use strict';

const React = require('react');

const CommentAction = require('../actions/CommentAction');
const CommentStore = require('../stores/CommentStore');
const storeMixin = require('./StoreMixin');

const CommentEdit = React.createClass({
  displayName: 'CommentEdit',

  mixins: [storeMixin()],

  stores: [CommentStore],

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    referenceId: React.PropTypes.string.isRequired,
    commentId: React.PropTypes.string
  },

  _getStateFromStores: function() {
    let value = CommentStore.getCommentText(this.props.tripId,
      this.props.referenceId, this.props.commentId);
    if (value) {
      value = value.replace(/&lf;/g, '\n\n');
    }
    return {
      value: value
    };
  },

  _stopEditing: function(event) {
    let value = this.state.value;
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
    let value = '';
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
    let value = this.state.value;
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
