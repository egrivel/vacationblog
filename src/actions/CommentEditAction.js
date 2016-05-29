'use strict';

var AppDispatcher = require('../AppDispatcher');

var CommentEditAction = {
  Types: {
    COMMENT_SET_EDITING: 'COMMENT_SET_EDITING',
    COMMENT_SET_VALUE: 'COMMENT_SET_VALUE'
  },

  setEditing(tripId, referenceId, isEditing) {
    AppDispatcher.dispatch({
      type: this.Types.COMMENT_SET_EDITING,
      tripId: tripId,
      referenceId: referenceId,
      isEditing: isEditing
    });
  },

  setValue(tripId, referenceId, value) {
    AppDispatcher.dispatch({
      type: this.Types.COMMENT_SET_VALUE,
      tripId: tripId,
      referenceId: referenceId,
      value: value
    });
  }

};

module.exports = CommentEditAction;
