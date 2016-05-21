'use strict';

/* global document */

var UserAction = require('./UserAction');
var utils = require('./utils');

var LoginAction = {
  _doLoginCallback: function(response) {
    var data = JSON.parse(response);
    if (data.resultCode === '200') {
      var authId = data.authId;
      if (authId) {
        document.cookie = 'blogAuthId=' + encodeURIComponent(authId);
      } else {
        document.cookie = 'blogAuthId=';
      }

      if (this.loginUserId) {
        UserAction.setLoggedInUser(this.loginUserId);
        UserAction.loadUser(this.loginUserId);
      } else {
        UserAction.setLoggedInUser('');
      }
    }
  },

  doLogin: function(userName, password) {
    var url = 'api/login.php';
    var data = {
      userId: userName,
      password: password
    };
    this.loginUserId = userName;
    utils.postAsync(url, data, this._doLoginCallback.bind(this));
  },

  doLogout: function() {
    var url = 'api/logout.php';
    this.loginUserId = '';
    utils.getAsync(url, this._doLoginCallback.bind(this));
  }
};

module.exports = LoginAction;
