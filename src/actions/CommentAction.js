'use strict';

var AppDispatcher = require('../AppDispatcher');
var UserAction = require('./UserAction');
var utils = require('./utils');

var CommentAction = {
  Types: {
    COMMENT_DATA: 'COMMENT_DATA'
  },

  /**
   * Load all the comments for the specified item.
   * @param {id} tripId - trip of the specified item.
   * @param {id} referenceId - unique ID of the specified item.
   */
  loadComments: function(tripId, referenceId) {
    var url = 'api/getComment.php?tripId=' + tripId +
      '&referenceId=' + referenceId;

    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
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
    var url = 'api/getComment.php?tripId=' + tripId +
      '&referenceId=' + referenceId;

    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
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

    for (var i = 0; i < data.count; i++) {
      if (data.list[i].userId) {
        UserAction.loadUser(data.list[i].userId);
      }
      this.recursivelyLoadComments(tripId, data.list[i].commentId);
    }
  }
};

module.exports = CommentAction;
