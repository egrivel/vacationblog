'use strict';

var React = require('react');

var CommentEditAction = require('../actions/CommentEditAction');
var CommentAction = require('../actions/CommentAction');
var CommentEditStore = require('../stores/CommentEditStore');
var UserStore = require('../stores/UserStore');
var storeMixin = require('./StoreMixin');

var CommentEdit = React.createClass({
  displayName: 'CommentEdit',

  mixins: [storeMixin()],

  stores: [CommentEditStore, UserStore],

  propTypes: {
    tripId: React.PropTypes.string.isRequired,
    referenceId: React.PropTypes.string.isRequired,
    commentId: React.PropTypes.string
  },

  _getStateFromStores: function() {
    var isEditing = CommentEditStore.isEditing(this.props.tripId,
      this.props.referenceId, this.props.commentId);
    var value = CommentEditStore.getValue(this.props.tripId,
      this.props.referenceId, this.props.commentId);
    var commentUserId = CommentEditStore.getCommentUserId(this.props.tripId,
      this.props.referenceId, this.props.commentId);
    var userId = UserStore.getLoggedInUser();
    var canEdit = false;
    if (this.props.commentId) {
      canEdit = (userId === commentUserId);
    } else {
      canEdit = true;
    }
    return {
      canEdit: canEdit,
      isEditing: isEditing,
      value: value
    };
  },

  _startEditing: function(event) {
    CommentEditAction.setEditing(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      true);
    event.preventDefault();
    event.stopPropagation();
  },

  _stopEditing: function(event) {
    CommentEditAction.setEditing(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      false);
    event.preventDefault();
    event.stopPropagation();
  },

  _updateValue: function(event) {
    CommentEditAction.setValue(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      event.target.value);
    event.preventDefault();
    event.stopPropagation();
  },

  _doPost: function() {
    CommentAction.postComment(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      this.state.value);
    CommentEditAction.setEditing(this.props.tripId,
      this.props.referenceId, this.props.commentId,
      false);
  },

  render: function() {
    var body;
    if (this.state.isEditing) {
      body = (
        <div className="commentEdit">
          Comment:
          <textarea autoFocus className="comment" value={this.state.value}
            ref="editbox" onChange={this._updateValue}/>
          <button onClick={this._doPost}>Post</button>
          <button onClick={this._stopEditing}>Cancel</button>
        </div>
      );
    } else if (this.state.canEdit) {
      body = (
        <div className="commentEdit">
          <a href="#" onClick={this._startEditing} className="addComment">
            Add a comment
          </a>
        </div>
      );
    } else {
      body = (
        <div className="commentEdit">
          (Please login to respond to this.)
        </div>
      );
    }
    // return (
    //   <div className="commentBlock">
    //     {body}
    //   </div>
    // );
    return body;
  }
});

module.exports = CommentEdit;
