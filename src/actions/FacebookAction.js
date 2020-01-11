'use strict';

/**
 * Trip Actions. This is a set of actions regarding trips, including the list
 * of contributors to a trip ("trip users").
 */

import AppDispatcher from '../AppDispatcher';
import utils from './utils';
import FacebookActionTypes from './FacebookActionTypes';

let _isLoadingStatus = false;
let _isLoadingDetails = false;

const FacebookAction = {
  Types: FacebookActionTypes,

  getStatus: function() {
    if (typeof FB !== 'undefined' && !_isLoadingStatus) {
      setTimeout(function() {
        AppDispatcher.dispatch({
          type: FacebookAction.Types.FB_STATUS,
          data: 'loading'
        });
      }, 0);
      _isLoadingStatus = true;

      FB.getLoginStatus(function(response) {
        _isLoadingStatus = false;
        if (response && response.status) {
          AppDispatcher.dispatch({
            type: FacebookAction.Types.FB_STATUS,
            data: response.status
          });
        }
      });
    }
  },

  setStatus: function(status) {
    AppDispatcher.dispatch({
      type: FacebookAction.Types.FB_STATUS,
      data: status
    });
  },

  loadDetails: function() {
    if (!_isLoadingDetails) {
      _isLoadingDetails = true;
      FB.api('/me', function(response) {
        _isLoadingDetails = false;
        if (response && response.name) {
          AppDispatcher.dispatch({
            type: FacebookAction.Types.FB_DATA,
            email: response.email,
            id: response.id,
            name: response.name
          });
        }
      }, {fields: 'name,email'});
    }
  },

  unloadDetails: function() {
    AppDispatcher.dispatch({
      type: FacebookAction.Types.FB_CLEAR
    });
  },

  logout: function() {
    FB.logout(function(response) {
      // Nothing to do
    });
  },

  setAvailable: function(isAvailable) {
    AppDispatcher.dispatch({
      type: FacebookAction.Types.FB_AVAILABLE,
      available: isAvailable
    });
  }
};

export default FacebookAction;
