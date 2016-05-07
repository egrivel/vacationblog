'use strict';

var AppDispatcher = require('../AppDispatcher');

var FeedbackAction = {
  Types: {
    FEEDBACK_SET_LIKE: 'FEEDBACK_SET_LIKE',
    FEEDBACK_CLEAR_LIKE: 'FEEDBACK_CLEAR_LIKE',
    FEEDBACK_SET_PLUS: 'FEEDBACK_SET_PLUS',
    FEEDBACK_CLEAR_PLUS: 'FEEDBACK_CLEAR_PLUS'
  },

  setLike: function(tripId, referenceId, userId) {
    AppDispatcher.dispatch({
      type: FeedbackAction.Types.FEEDBACK_SET_LIKE,
      tripId: tripId,
      referenceId: referenceId,
      userId: userId
    });
  },

  clearLike: function(tripId, referenceId, userId) {
    AppDispatcher.dispatch({
      type: FeedbackAction.Types.FEEDBACK_CLEAR_LIKE,
      tripId: tripId,
      referenceId: referenceId,
      userId: userId
    });
  },

  setPlus: function(tripId, referenceId, userId) {
    AppDispatcher.dispatch({
      type: FeedbackAction.Types.FEEDBACK_SET_PLUS,
      tripId: tripId,
      referenceId: referenceId,
      userId: userId
    });
  },

  clearPlus: function(tripId, referenceId, userId) {
    AppDispatcher.dispatch({
      type: FeedbackAction.Types.FEEDBACK_CLEAR_PLUS,
      tripId: tripId,
      referenceId: referenceId,
      userId: userId
    });
  }

};

module.exports = FeedbackAction;
