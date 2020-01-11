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

import _ from 'lodash';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import GenericStore from './GenericStore';
import CommentActionTypes from '../actions/CommentActionTypes';

// ---
// Comment structure. The _commentData is indexed by the tripId / referenceId
// index and contains an array of comment IDs that reference that particular
// trip ID / reference ID combination.
// ---
let _commentData = [];

// ---
// Comment details: the specifics for an individual comment. Indexed
// by comment ID.
// ---
let _commentDetails = [];

// ---
// Keep track of which comments are being edited. This can either be an existing
// comment (index is specific comment ID) or a new comment (index is the
// generated index for trip ID and reference ID).
// ---
let _isEditing = [];

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

  const commentId = listItem.commentId;
  if (_commentDetails[commentId] &&
    _.isEqual(_commentDetails[commentId], listItem)) {
    // details are not changing
    return false;
  }
  _commentDetails[commentId] = _.cloneDeep(listItem);

  const index = _makeIndex(listItem.tripId, listItem.referenceId);
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

const CommentStore = assign({}, GenericStore, {
  /**
   * Reset store contents for testing.
   */
  _reset: function() {
    _commentData = [];
    _commentDetails = [];
    _isEditing = [];
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
    const result = [];

    if (tripId && referenceId) {
      const index = _makeIndex(tripId, referenceId);
      if (_commentData[index]) {
        for (let i = 0; i < _commentData[index].length; i++) {
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
    const result = this.getList(tripId, referenceId);
    if (result) {
      for (let i = 0; i < result.length; i++) {
        const list = CommentStore.getRecursiveList(tripId, result[i].commentId);
        if (list) {
          result[i].childComments = list;
        }
      }
    }
    return result;
  },

  canEditComment: function(commentId, userId) {
    if (commentId && userId && _commentDetails[commentId]) {
      if (_commentDetails[commentId].userId) {
        return _commentDetails[commentId].userId === userId;
      }
    }
    return false;
  },

  isEditing: function(tripId, referenceId, commentId) {
    if (commentId && _isEditing[commentId]) {
      return true;
    } else if (tripId && referenceId) {
      const index = _makeIndex(tripId, referenceId);
      if (_isEditing[index]) {
        return true;
      }
    }
    return false;
  },

  getCommentText: function(tripId, referenceId, commentId) {
    if (commentId) {
      if (_commentDetails[commentId]) {
        return _commentDetails[commentId].commentText;
      }
    } else if (tripId && referenceId) {
      const index = _makeIndex(tripId, referenceId);
      if (_commentDetails[index]) {
        return _commentDetails[index].commentText;
      }
    }
    return '';
  },

  _storeCallback: function(action) {
    let index;
    switch (action.type) {
      case CommentActionTypes.COMMENT_DATA:
        let isChanged = false;
        if (action.data && action.data.list) {
          for (let i = 0; action.data.list[i]; i++) {
            isChanged |= _setData(action.data.list[i]);
          }
        }
        if (isChanged) {
          CommentStore.emitChange();
        }
        break;

      case CommentActionTypes.COMMENT_SET_EDITING:
        let value = false;
        if (action.value) {
          value = true;
        }
        if (action.commentId) {
          _isEditing[action.commentId] = value;
        } else if (action.tripId && action.referenceId) {
          index = _makeIndex(action.tripId, action.referenceId);
          _isEditing[index] = value;
        }
        CommentStore.emitChange();
        break;

      case CommentActionTypes.COMMENT_SET_TEXT:
        if (action.commentId) {
          if (!_commentDetails[action.commentId]) {
            _commentDetails[action.commentId] = {};
          }
          _commentDetails[action.commentId].commentText = action.value;
        } else if (action.tripId && action.referenceId) {
          index = _makeIndex(action.tripId, action.referenceId);
          if (!_commentDetails[index]) {
            _commentDetails[index] = {};
          }
          _commentDetails[index].commentText = action.value;
        }
        CommentStore.emitChange();
        break;

      default:
        // do nothing
    }
  }

});

CommentStore.dispatchToken =
  AppDispatcher.register(CommentStore._storeCallback);

export default CommentStore;
