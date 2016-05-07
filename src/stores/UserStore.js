'use strict';

var assign = require('object-assign');

var GenericStore = require('./GenericStore');
var AppDispatcher = require('../AppDispatcher');
var UserActionTypes = require('../actions/UserAction').Types;

var _userData = {};
var _userLoggedIn = '';

var UserStore = assign({}, GenericStore, {
  _reset: function() {
    _userData = {};
  },

  /**
   * Obtain all the information of the user item.
   * @param {id} userId - ID of the user whose data is requested.
   * @return {object} Data for the requested user.
   */
  getData: function(userId) {
    var data = _userData[userId];
    return data;
  },

  getLoggedInUser: function() {
    return _userLoggedIn;
  },

  getAccess: function() {
    if (_userLoggedIn) {
      var user = _userData[_userLoggedIn];
      if (user && user.access) {
        return user.access;
      }
    }
    return '';
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case UserActionTypes.USER_SET_DATA:
        var userId = action.data.userId;
        _userData[userId] = action.data;
        UserStore.emitChange();
        break;
      case UserActionTypes.USER_SET_LOGGED_IN:
        if (_userLoggedIn !== action.userId) {
          _userLoggedIn = action.userId;
          UserStore.emitChange();
        }
        break;
      default:
        // do nothing
        break;
    }
  }
});

UserStore.dispatchToken = AppDispatcher.register(UserStore._storeCallback);

module.exports = UserStore;
