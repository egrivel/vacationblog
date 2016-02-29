'use strict';

var assign = require('object-assign');

var GenericStore = require('./GenericStore');
var AppDispatcher = require('../AppDispatcher');
var UserActionTypes = require('../actions/UserAction').Types;

var _userData = {};

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

  _storeCallback: function(action) {
    switch (action.type) {
      case UserActionTypes.USER_DATA:
        var userId = action.data.userId;
        if (_userData[userId] !== action.data) {
          _userData[userId] = action.data;
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
