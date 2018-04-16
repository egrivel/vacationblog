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
    FB_EMAIL: 'FB_EMAIL',
    FB_NAME: 'FB_NAME',
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

  loadEmail: function() {},

  loadName: function() {
    if (!_isLoadingName) {
      _isLoadingName = true;
      FB.api('/me', function(response) {
        _isLoadingName = false;
        console.log('Got response: ' + JSON.stringify(response));
        if (response && response.name) {
          AppDispatcher.dispatch({
            type: FacebookAction.Types.FB_NAME,
            data: response.name
          });
        }
      });
    }
  }
};

module.exports = FacebookAction;
