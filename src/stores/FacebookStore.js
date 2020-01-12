
/**
 * Trip Store
 *
 * Provides trip information. This includes:
 *  - List of all the trips in the system.
 *  - ID of the current trip.
 *  - All the attributes of the current trip.
 */
import assign from 'object-assign';

import AppDispatcher from '../AppDispatcher';
import GenericStore from './GenericStore';
import FacebookActionTypes from '../actions/FacebookActionTypes';

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
        FacebookStore.emitChange();
        break;

      default:
        // do nothing
    }
  }
});

FacebookStore.dispatchToken = AppDispatcher.register(FacebookStore._storeCallback);

export default FacebookStore;
