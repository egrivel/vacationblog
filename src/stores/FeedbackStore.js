'use strict';

import _ from 'lodash';
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import GenericStore from './GenericStore';
import FeedbackActionTypes from '../actions/FeedbackActionTypes';

const _data = {};

let FeedbackStore = {};

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
  const itemId = _makeId(tripId, referenceId);
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
    let count = 0;
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type === 'like') {
          count++;
        }
      }
    }
    return count;
  },

  getPlusCount: function(tripId, referenceId) {
    let count = 0;
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type === 'plus') {
          count++;
        }
      }
    }
    return count;
  },

  getSmileCount: function(tripId, referenceId) {
    let count = 0;
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].type === 'smile') {
          count++;
        }
      }
    }
    return count;
  },

  doesUserLike: function(tripId, referenceId, userId) {
    let doesLike = false;
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if ((list[i].type === 'like') &&
            (list[i].userId === userId)) {
          doesLike++;
        }
      }
    }
    return doesLike;
  },

  doesUserPlus: function(tripId, referenceId, userId) {
    let doesPlus = false;
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if ((list[i].type === 'plus') &&
            (list[i].userId === userId)) {
          doesPlus++;
        }
      }
    }
    return doesPlus;
  },

  doesUserSmile: function(tripId, referenceId, userId) {
    let doesSmile = false;
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if ((list[i].type === 'smile') &&
            (list[i].userId === userId)) {
          doesSmile++;
        }
      }
    }
    return doesSmile;
  },

  getLikeList: function(tripId, referenceId, userId) {
    if (!userId) {
      userId = '';
    }
    let result = '';
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
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
    let result = '';
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
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

  getSmileList: function(tripId, referenceId, userId) {
    if (!userId) {
      userId = '';
    }
    let result = '';
    const itemId = _makeId(tripId, referenceId);
    const list = _data[itemId];
    if (list) {
      for (let i = 0; i < list.length; i++) {
        if ((list[i].type === 'smile') &&
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

export default FeedbackStore;
