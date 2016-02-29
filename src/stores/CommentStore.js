'use strict';

/**
 * Comment store.
 *
 * Provide information about the currently displayed journal entry.
 *
 * The following information is returned (this is based on the information
 * returned by the API call to get a comment):
 *  - tripId
 *  - commentId
 *  - created
 *  - updated
 *  - userId
 *  - referenceId (the ID of the object this is a comment on)
 *  - commentText
 *  - deleted (Y/N)
 */

var _ = require('lodash');
var assign = require('object-assign');

var AppDispatcher = require('../AppDispatcher');
var GenericStore = require('./GenericStore');
var CommentActionTypes = require('../actions/CommentAction').Types;

// ---
// All the data about the comments. Data structure:
// _commentData is an array indexed by trip ID and reference ID. Each item
// in the array is an object with comment ID properties. Each of those
// properties is a whole comment object.
// ---
var _commentData = [];

/**
 * Make a unique index string.
 * @param {id} tripId - trip ID for index.
 * @param {id} referenceId - reference ID for the index.
 * @return {string} unique index name for the trip and reference compbination.
 */
function _makeIndex(tripId, referenceId) {
  return tripId + '|' + referenceId;
}

/**
 * Set the data for a comment item.
 * @param {object} data - comment data to set.
 * @return {boolean} true if any data was changed.
 */
function _setData(data) {
  var index = _makeIndex(data.tripId, data.referenceId);
  if (_commentData[index]) {
    if (_commentData[index][data.commentId]) {
      if (_.isEqual(_commentData[index][data.commentId], data)) {
        // data is already there
        return false;
      }
    }
  } else {
    _commentData[index] = {};
  }

  _commentData[index][data.commentId] = _.cloneDeep(data);
  return true;
}

var CommentStore = assign({}, GenericStore, {
  /**
   * Reset store contents for testing.
   */
  _reset: function() {
    _commentData = [];
  },

  /**
   * Obtain all the attributes of the requested comment[s]
   * @param {id} tripId - unique trip ID.
   * @param {id} referenceId - unique reference ID.
   * @return {array} list of comments on the indicated item.
   */
  getData: function(tripId, referenceId) {
    var result;
    var obj = _commentData[_makeIndex(tripId, referenceId)];
    if (obj) {
      result = [];
      _.forEach(obj, function(item) {
        result.push(item);
      });
    }
    return result;
  },

  /**
   * Get a recursive structure with the comment information.
   * @param {id} tripId - unique trip ID.
   * @param {id} referenceId - unique reference ID.
   * @return {array} list of comments on the indicated item, where each
   * comment element has its own 'comments' list.
   */
  getRecursiveData: function(tripId, referenceId) {
    var result = this.getData(tripId, referenceId);
    if (result) {
      for (var i = 0; i < result.length; i++) {
        result[i].comments =
          this.getRecursiveData(tripId, result[i].commentId);
      }
    }
    return result;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case CommentActionTypes.COMMENT_DATA:
        if (_setData(action.data)) {
          CommentStore.emitChange();
        }
        break;
      default:
        // do nothing
    }
  }

});

CommentStore.dispatchToken =
  AppDispatcher.register(CommentStore._storeCallback);

module.exports = CommentStore;
