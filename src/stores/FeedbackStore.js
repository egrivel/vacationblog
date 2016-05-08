'use strict';

var assign = require('object-assign');

var AppDispatcher = require('../AppDispatcher');
var GenericStore = require('./GenericStore');
var FeedbackActionTypes = require('../actions/FeedbackAction').Types;

var _likeList = {};
var _likeCountList = {};
var _plusList = {};
var _plusCountList = {};

var FeedbackStore = {};

/**
 * Make an ID
 *
 * @param {String} tripId - unique ID for the trip.
 * @param {String} referenceId - unique ID for the reference
 * @param {String} userId - user who likes the item
 * @return {String} ID for the item.
 */
function _makeId(tripId, referenceId, userId) {
  if (!userId) {
    userId = '';
  }
  return tripId + ':' + referenceId + ':' + userId;
}

/**
 * Set a like
 *
 * @param {String} tripId - unique ID for the trip.
 * @param {String} referenceId - unique ID for the reference
 * @param {String} userId - user who likes the item
 */
function _setLike(tripId, referenceId, userId) {
  var itemId = _makeId(tripId, referenceId, userId);
  var itemCountId = _makeId(tripId, referenceId);
  if (!_likeList[itemId]) {
    _likeList[itemId] = true;
    if (_likeCountList[itemCountId]) {
      _likeCountList[itemCountId]++;
    } else {
      _likeCountList[itemCountId] = 1;
    }
    FeedbackStore.emitChange();
  }
}

/**
 * Set a plus
 *
 * @param {String} tripId - unique ID for the trip.
 * @param {String} referenceId - unique ID for the reference
 * @param {String} userId - user who likes the item
 */
function _setPlus(tripId, referenceId, userId) {
  var itemId = _makeId(tripId, referenceId, userId);
  var itemCountId = _makeId(tripId, referenceId);
  if (!_plusList[itemId]) {
    _plusList[itemId] = true;
    if (_plusCountList[itemCountId]) {
      _plusCountList[itemCountId]++;
    } else {
      _plusCountList[itemCountId] = 1;
    }
    FeedbackStore.emitChange();
  }
}

/**
 * Clear a like
 *
 * @param {String} tripId - unique ID for the trip.
 * @param {String} referenceId - unique ID for the reference
 * @param {String} userId - user who likes the item
 */
function _clearLike(tripId, referenceId, userId) {
  var itemId = _makeId(tripId, referenceId, userId);
  var itemCountId = _makeId(tripId, referenceId);
  if (_likeList[itemId]) {
    _likeList[itemId] = false;
    if (_likeCountList[itemCountId]) {
      _likeCountList[itemCountId]--;
    } else {
      _likeCountList[itemCountId] = 0;
    }
    FeedbackStore.emitChange();
  }
}

/**
 * Clear a plus
 *
 * @param {String} tripId - unique ID for the trip.
 * @param {String} referenceId - unique ID for the reference
 * @param {String} userId - user who likes the item
 */
function _clearPlus(tripId, referenceId, userId) {
  var itemId = _makeId(tripId, referenceId, userId);
  var itemCountId = _makeId(tripId, referenceId);
  if (_plusList[itemId]) {
    _plusList[itemId] = false;
    if (_plusCountList[itemCountId]) {
      _plusCountList[itemCountId]--;
    } else {
      _plusCountList[itemCountId] = 0;
    }
    FeedbackStore.emitChange();
  }
}

FeedbackStore = assign({}, GenericStore, {
  getLikeCount: function(tripId, referenceId) {
    var likeId = _makeId(tripId, referenceId);
    var count = _likeCountList[likeId];
    if (!count) {
      count = 0;
    }
    return count;
  },

  getPlusCount: function(tripId, referenceId) {
    var itemId = _makeId(tripId, referenceId);
    var count = _plusCountList[itemId];
    if (!count) {
      count = 0;
    }
    return count;
  },

  doesUserLike: function(tripId, referenceId, userId) {
    var itemId = _makeId(tripId, referenceId, userId);
    return _likeList[itemId];
  },

  doesUserPlus: function(tripId, referenceId, userId) {
    var itemId = _makeId(tripId, referenceId, userId);
    return _plusList[itemId];
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case FeedbackActionTypes.FEEDBACK_SET_LIKE:
        _setLike(action.tripId, action.referenceId, action.userId);
        break;
      case FeedbackActionTypes.FEEDBACK_CLEAR_LIKE:
        _clearLike(action.tripId, action.referenceId, action.userId);
        break;
      case FeedbackActionTypes.FEEDBACK_SET_PLUS:
        _setPlus(action.tripId, action.referenceId, action.userId);
        break;
      case FeedbackActionTypes.FEEDBACK_CLEAR_PLUS:
        _clearPlus(action.tripId, action.referenceId, action.userId);
        break;
      default:
        // do nothing
    }
  }

});

FeedbackStore.dispatchToken =
  AppDispatcher.register(FeedbackStore._storeCallback);

module.exports = FeedbackStore;
