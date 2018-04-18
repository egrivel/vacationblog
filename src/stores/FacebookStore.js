'use strict';

/**
 * Trip Store
 *
 * Provides trip information. This includes:
 *  - List of all the trips in the system.
 *  - ID of the current trip.
 *  - All the attributes of the current trip.
 */
const _ = require('lodash');
const assign = require('object-assign');

const AppDispatcher = require('../AppDispatcher');
const GenericStore = require('./GenericStore');
const FacebookActionTypes = require('../actions/FacebookAction').Types;

let _facebookName;
let _facebookStatus;

const FacebookStore = assign({}, GenericStore, {
  getName: function() {
    return _facebookName;
  },

  getStatus: function() {
    return _facebookStatus;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case FacebookActionTypes.FB_NAME:
        _facebookName = action.data;
        FacebookStore.emitChange();
        break;

      case FacebookActionTypes.FB_STATUS:
        _facebookStatus = action.data;
        FacebookStore.emitChange();
        break;

      default:
        // do nothing
    }
  }
});

FacebookStore.dispatchToken = AppDispatcher.register(FacebookStore._storeCallback);

module.exports = FacebookStore;
