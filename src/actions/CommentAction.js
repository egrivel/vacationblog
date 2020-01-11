'use strict';

import AppDispatcher from '../AppDispatcher';
import UserAction from './UserAction';
import UserStore from '../stores/UserStore';
import utils from './utils';
import CommentActionTypes from './CommentActionTypes';

const CommentAction = {
  Types: CommentActionTypes,

  /**
   * Load all the comments for the specified item.
   * @param {id} tripId - trip of the specified item.
   * @param {id} referenceId - unique ID of the specified item.
   */
  loadComments: function(tripId, referenceId) {
    const url = 'api/getComment.php?' +
      'tripId=' + encodeURIComponent(tripId) +
      '&referenceId=' + encodeURIComponent(referenceId);

    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      CommentAction._commentsLoaded(tripId, referenceId, data);
    });
  },

  /**
   * Callback when comments have been loaded. This will send the
   * comments to the store.
   * @param {id} tripId - unique trip ID for the comments.
   * @param {id} referenceId - unique ID of the object to which the
   * comments apply.
   * @param {object} data - comment data returned by the API.
   */
  _commentsLoaded: function(tripId, referenceId, data) {
    AppDispatcher.dispatch({
      type: this.Types.COMMENT_DATA,
      data: {
        tripId: tripId,
        referenceId: referenceId,
        count: data.count,
        list: data.list
      }
    });
  },

  /**
   * Load comments recursively, that is, include comments on comments
   * in the load.
   * @param {ID} tripId - unique trip ID;
   * @param {ID} referenceId - reference ID for item to load
   */
  recursivelyLoadComments: function(tripId, referenceId) {
    const url = 'api/getComment.php?' +
      'tripId=' + encodeURIComponent(tripId) +
      '&referenceId=' + encodeURIComponent(referenceId);
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      CommentAction._recursiveCommentsLoaded(tripId, referenceId, data);
    });
  },

  /**
   * Callback when comments have been loaded. This will send the
   * comments to the store.
   * @param {id} tripId - unique trip ID for the comments.
   * @param {id} referenceId - unique ID of the object to which the
   * comments apply.
   * @param {object} data - comment data returned by the API.
   */
  _recursiveCommentsLoaded: function(tripId, referenceId, data) {
    AppDispatcher.dispatch({
      type: this.Types.COMMENT_DATA,
      data: {
        tripId: tripId,
        referenceId: referenceId,
        count: data.count,
        list: data.list
      }
    });

    for (let i = 0; i < data.count; i++) {
      if (data.list[i].userId) {
        UserAction.loadUser(data.list[i].userId);
      }
      this.recursivelyLoadComments(tripId, data.list[i].commentId);
    }
  },

  postComment: function(tripId, referenceId, commentId, text) {
    const userId = UserStore.getLoggedInUser();
    const data = {
      userId: userId,
      tripId: tripId,
      referenceId: referenceId,
      commentId: commentId,
      commentText: text
    };
    utils.postAsync('api/putComment.php', data, function(response) {
      const data = JSON.parse(response);
      if (data.resultCode === '200') {
        CommentAction.recursivelyLoadComments(tripId, referenceId);
      }
    });
  },

  setEditing: function(tripId, referenceId, commentId, value) {
    AppDispatcher.dispatch({
      type: CommentAction.Types.COMMENT_SET_EDITING,
      tripId: tripId,
      referenceId: referenceId,
      commentId: commentId,
      value: value
    });
  },

  setCommentText: function(tripId, referenceId, commentId, value) {
    AppDispatcher.dispatch({
      type: CommentAction.Types.COMMENT_SET_TEXT,
      tripId: tripId,
      referenceId: referenceId,
      commentId: commentId,
      value: value
    });
  }
};

export default CommentAction;
