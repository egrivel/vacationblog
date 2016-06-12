'use strict';

var AppDispatcher = require('../AppDispatcher');

var CommentEditAction = {
  Types: {
    COMMENT_SET_EDITING: 'COMMENT_SET_EDITING',
    COMMENT_SET_VALUE: 'COMMENT_SET_VALUE'
  },

  setEditing(tripId, referenceId, commentId, isEditing) {
    AppDispatcher.dispatch({
      type: this.Types.COMMENT_SET_EDITING,
      tripId: tripId,
      referenceId: referenceId,
      commentId: commentId,
      isEditing: isEditing
    });
  },

  setValue(tripId, referenceId, commentId, value) {
    AppDispatcher.dispatch({
      type: this.Types.COMMENT_SET_VALUE,
      tripId: tripId,
      referenceId: referenceId,
      commentId: commentId,
      value: value
    });
  }

};

module.exports = CommentEditAction;
