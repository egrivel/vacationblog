'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import CommentAction from '../actions/CommentAction';
import CommentStore from '../stores/CommentStore';
import storeMixin from './StoreMixin';

const CommentEdit = createReactClass({
  displayName: 'CommentEdit',

  mixins: [storeMixin()],

  stores: [CommentStore],

  propTypes: {
    tripId: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
    commentId: PropTypes.string
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

export default CommentEdit;
