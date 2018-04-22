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

let _facebookAvailable = false;
let _facebookEmail;
let _facebookId;
let _facebookName;
let _facebookStatus;

const FacebookStore = assign({}, GenericStore, {
  getEmail: function() {
    return _facebookEmail;
  },

  getId: function() {
    return _facebookId;
  },

  getName: function() {
    return _facebookName;
  },

  getStatus: function() {
    return _facebookStatus;
  },

  isAvailable: function() {
    return _facebookAvailable;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case FacebookActionTypes.FB_DATA:
        _facebookEmail = action.email;
        _facebookId = action.id;
        _facebookName = action.name;
        FacebookStore.emitChange();
        break;

      case FacebookActionTypes.FB_STATUS:
        _facebookStatus = action.data;
        FacebookStore.emitChange();
        break;

      case FacebookActionTypes.FB_CLEAR:
        _facebookEmail = undefined;
        _facebookId = undefined;
        _facebookName = undefined;
        FacebookStore.emitChange();
        break;

      case FacebookActionTypes.FB_AVAILABLE:
        _facebookAvailable = action.available;
        console.log('setting available to ' + _facebookAvailable);
        FacebookStore.emitChange();
        break;

      default:
        // do nothing
    }
  }
});

FacebookStore.dispatchToken = AppDispatcher.register(FacebookStore._storeCallback);

module.exports = FacebookStore;
