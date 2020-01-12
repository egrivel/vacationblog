import AppDispatcher from '../AppDispatcher';
import utils from './utils';
import FeedbackActionTypes from './FeedbackActionTypes';

const FeedbackAction = {
  Types: FeedbackActionTypes,

  loadData: (tripId, referenceId) => {
    let url = 'api/getFeedback.php?';
    url += 'tripId=' + encodeURIComponent(tripId);
    url += '&referenceId=' + encodeURIComponent(referenceId);
    utils.getAsync(url, (response) => {
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
      () => FeedbackAction.loadData(tripId, referenceId));
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
      () => FeedbackAction.loadData(tripId, referenceId));
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
      () => FeedbackAction.loadData(tripId, referenceId));
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
      () => FeedbackAction.loadData(tripId, referenceId));
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
      () => FeedbackAction.loadData(tripId, referenceId));
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
      () => FeedbackAction.loadData(tripId, referenceId));
  }
};

export default FeedbackAction;
