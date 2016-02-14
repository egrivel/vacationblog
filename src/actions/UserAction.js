'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var UserAction = {
  Types: {
    USER_DATA: 'USER_DATA'
  },

  smartLoadUser: function(userId) {
    var UserStore = require('../stores/UserStore');
    if (!UserStore.getData(userId)) {
      this.loadUser(userId);
    }
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
      type: this.Types.USER_DATA,
      data: data
    });
  }
};

module.exports = UserAction;
