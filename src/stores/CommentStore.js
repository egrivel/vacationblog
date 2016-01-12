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
// All the data about the comments.
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
  var tripId = data.tripId;
  var referenceId = data.referenceId;
  var isChanged = false;

  var index = _makeIndex(tripId, referenceId);
  if (!_commentData[index] || !_.isEqual(_commentData[index], data)) {
    // only if the data wasn't there yet, or is different, should we
    // set the data and emit a change.
    _commentData[index] = data;
    isChanged = true;
  }
  return isChanged;
}

var CommentStore = assign({}, GenericStore, {
  /**
   * Obtain all the attributes of the requested comment[s]
   * @param {id} tripId - unique trip ID.
   * @param {id} referenceId - unique reference ID.
   * @return {array} list of comments on the indicated item.
   */
  getData: function(tripId, referenceId) {
    return _commentData[_makeIndex(tripId, referenceId)];
  }
});

const storeCallback = function(action) {
  switch (action.type) {
    case CommentActionTypes.COMMENT_DATA:
      if (_setData(action.data)) {
        CommentStore.emitChange();
      }
      break;
    default:
      // do nothing
  }
};

CommentStore.dispatchToken = AppDispatcher.register(storeCallback);

module.exports = CommentStore;
