'use strict';

/**
 * Trip Actions. This is a set of actions regarding trips, including the list
 * of contributors to a trip ("trip users").
 */

const AppDispatcher = require('../AppDispatcher');
const utils = require('./utils');

let _isLoadingStatus = false;
let _isLoadingName = false;

const FacebookAction = {
  Types: {
    FB_AVAILABLE: 'FB_AVAILABLE',
    FB_CLEAR: 'FB_CLEAR',
    FB_DATA: 'FB_DATA',
    FB_EMAIL: 'FB_EMAIL',
    FB_STATUS: 'FB_STATUS'
  },

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

  loadDetails: function() {
    if (!_isLoadingName) {
      _isLoadingName = true;
      FB.api('/me', function(response) {
        _isLoadingName = false;
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

module.exports = FacebookAction;
