'use strict';

var _ = require('lodash');
var assign = require('object-assign');

var AppDispatcher = require('../AppDispatcher');
var GenericStore = require('./GenericStore');
var FeedbackActionTypes = require('../actions/FeedbackAction').Types;

var _data = {};

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
 * Load data
 * @param {String} tripId - unique ID for the trip.
 * @param {String} referenceId - unique ID for the reference
 * @param {array} list - list of feedbacks
 */
function _load(tripId, referenceId, list) {
  var itemId = _makeId(tripId, referenceId);
  if (_data[itemId]) {
    if (_.isEqual(_data[itemId], list)) {
      // no need to do anything
      return;
    }
  }
  // only if needed, update the list and emit a change
  _data[itemId] = list;
  FeedbackStore.emitChange();
}

FeedbackStore = assign({}, GenericStore, {
  getLikeCount: function(tripId, referenceId) {
    var count = 0;
    var itemId = _makeId(tripId, referenceId);
    var list = _data[itemId];
    if (list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i].type === 'like') {
          count++;
        }
      }
    }
    return count;
  },

  getPlusCount: function(tripId, referenceId) {
    var count = 0;
    var itemId = _makeId(tripId, referenceId);
    var list = _data[itemId];
    if (list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if (list[i].type === 'plus') {
          count++;
        }
      }
    }
    return count;
  },

  doesUserLike: function(tripId, referenceId, userId) {
    var doesLike = false;
    var itemId = _makeId(tripId, referenceId);
    var list = _data[itemId];
    if (list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if ((list[i].type === 'like') &&
            (list[i].userId === userId)) {
          doesLike++;
        }
      }
    }
    return doesLike;
  },

  doesUserPlus: function(tripId, referenceId, userId) {
    var doesPlus = false;
    var itemId = _makeId(tripId, referenceId);
    var list = _data[itemId];
    if (list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if ((list[i].type === 'plus') &&
            (list[i].userId === userId)) {
          doesPlus++;
        }
      }
    }
    return doesPlus;
  },

  getLikeList: function(tripId, referenceId, userId) {
    if (!userId) {
      userId = '';
    }
    var result = '';
    var itemId = _makeId(tripId, referenceId);
    var list = _data[itemId];
    if (list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if ((list[i].type === 'like') &&
            (list[i].userId !== userId)) {
          if (result !== '') {
            result += ', ';
          }
          result += list[i].userName;
        }
      }
    }
    return result;
  },

  getPlusList: function(tripId, referenceId, userId) {
    if (!userId) {
      userId = '';
    }
    var result = '';
    var itemId = _makeId(tripId, referenceId);
    var list = _data[itemId];
    if (list) {
      var i;
      for (i = 0; i < list.length; i++) {
        if ((list[i].type === 'plus') &&
            (list[i].userId !== userId)) {
          if (result !== '') {
            result += ', ';
          }
          result += list[i].userName;
        }
      }
    }
    return result;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case FeedbackActionTypes.FEEDBACK_LOAD:
        _load(action.tripId, action.referenceId, action.list);
        break;
      default:
        // do nothing
    }
  }

});

FeedbackStore.dispatchToken =
  AppDispatcher.register(FeedbackStore._storeCallback);

// There can potentially be a *lot* of listeners to the feedback store, so
// set the limit high!
FeedbackStore.setMaxListeners(100);

module.exports = FeedbackStore;
