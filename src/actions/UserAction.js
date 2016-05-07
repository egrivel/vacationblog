'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var UserAction = {
  Types: {
    USER_SET_DATA: 'USER_SET_DATA',
    USER_SET_LOGGED_IN: 'USER_SET_LOGGED_IN'
  },

  loadUser: function loadUser(userId) {
    var url = 'api/getUser.php?userId=' + userId;
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      UserAction._userLoaded(data);
    });
  },

  _userLoaded: function _userLoaded(data) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_DATA,
      data: data
    });
  },

  setLoggedInUser: function(userId) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_LOGGED_IN,
      userId: userId
    });
  }
};

module.exports = UserAction;
