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
// Comment structure. The _commentData is indexed by the tripId / referenceId
// index and contains an array of comment IDs that reference that particular
// trip ID / reference ID combination.
// ---
var _commentData = [];

// ---
// Comment details: the specifics for an individual comment. Indexed
// by comment ID.
// ---
var _commentDetails = [];

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
 * @param {object} listItem - comment data to set. The listItem is a single
 * item in the 'list' returned by the api/getComment.php call, meaning it is an
 * object with the following attributes:
 *  - tripId
 *  - commentId
 *  - referenceId
 *  - userId
 *  - created
 *  - updated
 *  - commentText
 *  - deleted
 * @return {boolean} true if any data was changed.
 */
function _setData(listItem) {
  if (!listItem || !listItem.commentId) {
    // nothing to set
    return false;
  }

  var commentId = listItem.commentId;
  if (_commentDetails[commentId] &&
    _.isEqual(_commentDetails[commentId], listItem)) {
    // details are not changing
    return false;
  }
  _commentDetails[commentId] = _.cloneDeep(listItem);

  var index = _makeIndex(listItem.tripId, listItem.referenceId);
  if (_commentData[index]) {
    if (_.indexOf(_commentData[index], commentId) >= 0) {
      // entry is already there, but details still changed
      return true;
    }
  } else {
    _commentData[index] = [];
  }

  _commentData[index].push(commentId);
  return true;
}

var CommentStore = assign({}, GenericStore, {
  /**
   * Reset store contents for testing.
   */
  _reset: function() {
    _commentData = [];
    _commentDetails = [];
  },

  getUserId: function(commentId) {
    if (commentId && _commentDetails[commentId] &&
        _commentDetails[commentId].userId) {
      return _commentDetails[commentId].userId;
    }
    return '';
  },

  /**
   * Obtain all the attributes of the requested comment[s]
   * @param {id} tripId - unique trip ID.
   * @param {id} referenceId - unique reference ID.
   * @return {array} list of comments on the indicated item.
   * The array returned by this function consists of _cloned_
   * versions of the actual data.
   */
  getList: function(tripId, referenceId) {
    var result = [];

    if (tripId && referenceId) {
      var index = _makeIndex(tripId, referenceId);
      if (_commentData[index]) {
        for (var i = 0; i < _commentData[index].length; i++) {
          result.push(_.cloneDeep(_commentDetails[_commentData[index][i]]));
        }
      }
      return result;
    }
  },

  /**
   * Get a recursive structure with the comment information.
   * @param {id} tripId - unique trip ID.
   * @param {id} referenceId - unique reference ID.
   * @return {array} list of comments on the indicated item, where each
   * comment element has its own 'comments' list. This
   */
  getRecursiveList: function(tripId, referenceId) {
    var result = this.getList(tripId, referenceId);
    if (result) {
      for (var i = 0; i < result.length; i++) {
        var list = CommentStore.getRecursiveList(tripId, result[i].commentId);
        if (list) {
          result[i].childComments = list;
        }
      }
    }
    return result;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case CommentActionTypes.COMMENT_DATA:
        var isChanged = false;
        if (action.data && action.data.list) {
          for (var i = 0; action.data.list[i]; i++) {
            isChanged |= _setData(action.data.list[i]);
          }
        }
        if (isChanged) {
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
