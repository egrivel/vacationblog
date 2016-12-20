'use strict';

const assign = require('object-assign');

const AppDispatcher = require('../AppDispatcher');
const GenericStore = require('./GenericStore');

const SyncActionTypes = require('../actions/SyncAction').Types;

let _info = {};

const SyncStore = assign({}, GenericStore, {
  _reset: function() {
    _info = {};
  },

  getInfo: function() {
    return _info;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case SyncActionTypes.SYNC_UPDATE_INFO:
        if (action.info) {
          _info = action.info;
          SyncStore.emitChange();
        }
        break;

      case SyncActionTypes.SYNC_SET_MESSAGE:
        if (action.message) {
          _info.message = action.message;
          SyncStore.emitChange();
        }
        break;

      default:
        // do nothing
    }
  }
});

SyncStore.dispatchToken = AppDispatcher.register(SyncStore._storeCallback);

module.exports = SyncStore;
