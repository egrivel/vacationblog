'use strict';

import AppDispatcher from '../AppDispatcher';
import utils from './utils';
import FeedbackActionTypes from './FeedbackActionTypes';

const FeedbackAction = {
  Types: FeedbackActionTypes,

  _getCallback: function(tripId, referenceId) {
    return function(tripId, referenceId) {
      this.loadData(tripId, referenceId);
    }.bind(this, tripId, referenceId);
  },

  loadData: function(tripId, referenceId) {
    let url = 'api/getFeedback.php?';
    url += 'tripId=' + encodeURIComponent(tripId);
    url += '&referenceId=' + encodeURIComponent(referenceId);
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      AppDispatcher.dispatch({
        type: FeedbackAction.Types.FEEDBACK_LOAD,
        tripId: data.tripId,
        referenceId: data.referenceId,
        list: data.list
      });
    });
  },

  setLike: function(tripId, referenceId, userId) {
    const url = 'api/putFeedback.php';
    const data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'like';
    data.deleted = 'N';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  },

  clearLike: function(tripId, referenceId, userId) {
    const url = 'api/putFeedback.php';
    const data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'like';
    data.deleted = 'Y';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  },

  setPlus: function(tripId, referenceId, userId) {
    const url = 'api/putFeedback.php';
    const data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'plus';
    data.deleted = 'N';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  },

  clearPlus: function(tripId, referenceId, userId) {
    const url = 'api/putFeedback.php';
    const data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'plus';
    data.deleted = 'Y';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  },

  setSmile: function(tripId, referenceId, userId) {
    const url = 'api/putFeedback.php';
    const data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'smile';
    data.deleted = 'N';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  },

  clearSmile: function(tripId, referenceId, userId) {
    const url = 'api/putFeedback.php';
    const data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'smile';
    data.deleted = 'Y';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  }
};

export default FeedbackAction;
