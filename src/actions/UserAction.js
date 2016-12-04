'use strict';

var AppDispatcher = require('../AppDispatcher');
var utils = require('./utils');

var UserAction = {
  Types: {
    USER_SET_DATA: 'USER_SET_DATA',
    USER_SET_LOGGED_IN: 'USER_SET_LOGGED_IN',
    USER_SET_LOGIN_LOGIN_STATE: 'USER_SET_LOGIN_LOGIN_STATE',
    USER_SET_LOGIN_FORM_ERROR: 'USER_SET_LOGIN_FORM_ERROR',
    USER_SET_LIST: 'USER_SET_LIST',
    USER_SET_TEMP_CODE: 'USER_SET_TEMP_CODE'
  },

  loadLoggedInUser: function() {
    var url = 'api/getUser.php';
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      UserAction._userLoaded(data);
      UserAction.setLoggedInUser(data.userId);
    });
  },

  loadUser: function loadUser(userId) {
    var url = 'api/getUser.php?userId=' + userId;
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      UserAction._userLoaded(data);
    });
  },

  updateUser: function(data) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_DATA,
      data: data
    });
  },

  _userLoaded: function _userLoaded(data) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_DATA,
      data: data
    });
  },

  loadAllUsers: function() {
    const url = 'api/findUsers.php';
    utils.getAsync(url, function(response) {
      var data = JSON.parse(response);
      AppDispatcher.dispatch({
        type: UserAction.Types.USER_SET_LIST,
        list: data.resultSet
      });
    });
  },

  setLoggedInUser: function(userId) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_LOGGED_IN,
      userId: userId
    });
  },

  setLoginState: function(state) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_LOGIN_LOGIN_STATE,
      state: state
    });
  },

  setLoginFormError: function(errorMessage) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_LOGIN_FORM_ERROR,
      message: errorMessage
    });
  },

  setTempCode: function(userId, tempCode) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_TEMP_CODE,
      userId: userId,
      tempCode: tempCode
    });
  }
};

module.exports = UserAction;
