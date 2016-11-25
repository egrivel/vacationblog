'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var FeedbackAction = {
  Types: {
    FEEDBACK_LOAD: 'FEEDBACK_LOAD'
  },

  _getCallback: function(tripId, referenceId) {
    return function(tripId, referenceId) {
      this.loadData(tripId, referenceId);
    }.bind(this, tripId, referenceId);
  },

  loadData: function(tripId, referenceId) {
    var url = 'api/getFeedback.php?';
    url += 'tripId=' + encodeURIComponent(tripId);
    url += '&referenceId=' + encodeURIComponent(referenceId);
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      AppDispatcher.dispatch({
        type: FeedbackAction.Types.FEEDBACK_LOAD,
        tripId: data.tripId,
        referenceId: data.referenceId,
        list: data.list
      });
    });
  },

  setLike: function(tripId, referenceId, userId) {
    var url = 'api/putFeedback.php';
    var data = {};
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
    var url = 'api/putFeedback.php';
    var data = {};
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
    var url = 'api/putFeedback.php';
    var data = {};
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
    var url = 'api/putFeedback.php';
    var data = {};
    // Note: do NOT encode the data for a POST
    data.tripId = tripId;
    data.referenceId = referenceId;
    data.userId = userId;
    data.type = 'plus';
    data.deleted = 'Y';
    utils.postAsync(url, data,
      this._getCallback(tripId, referenceId));
  }
};

module.exports = FeedbackAction;
