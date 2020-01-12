'use strict';

import AppDispatcher from '../AppDispatcher';
import utils from './utils';
import UserActionTypes from './UserActionTypes';

const UserAction = {
  Types: UserActionTypes,

  loadLoggedInUser: function() {
    const url = 'api/getUser.php';
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      UserAction._userLoaded(data);
      UserAction.setLoggedInUser(data.userId);
    });
  },

  loadUser: function loadUser(userId) {
    const url = 'api/getUser.php?userId=' + userId;
    utils.getAsync(url, function(response) {
      const data = JSON.parse(response);
      UserAction._userLoaded(data);
    });
  },

  saveUser: function(userId, data) {
    const url = 'api/putUser.php';
    const submitData = {
      userId: userId,
      name: data.name,
      email: data.email,
      access: data.access,
      notification: data.notification,
      tempCode: data.tempCode,
      deleted: data.deleted
    };
    if (data.password && (data.password.length >= 6)) {
      submitData.password = data.password;
    }
    utils.postAsync(url, submitData, function(response) {
      const responseData = JSON.parse(response, true);
      if (!responseData.resultCode || (responseData.resultCode !== '200')) {
        console.log('Got response ' + response);
      }
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
      const data = JSON.parse(response);
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
  },

  initEdit: function(userId) {
    AppDispatcher.dispatch({
      type: this.Types.USER_INIT_EDIT,
      userId: userId
    });
  },

  setEdit: function(userId, prop, value) {
    AppDispatcher.dispatch({
      type: this.Types.USER_SET_EDIT,
      userId: userId,
      prop: prop,
      value: value
    });
  },

  clearEdit: function(userId) {
    AppDispatcher.dispatch({
      type: this.Types.USER_CLEAR_EDIT,
      userId: userId
    });
  },

  updatePrefs: function(userId, name, notification) {
    const url = 'api/putUser.php';
    const submitData = {
      userId: userId,
      name: name,
      notification: notification
    };
    utils.postAsync(url, submitData, function(response) {
      const responseData = JSON.parse(response, true);
      if (!responseData.resultCode || (responseData.resultCode !== '200')) {
        console.log('Got response ' + response);
      }
    });
  },

  updateEmail: function(/* userId, newEmail */) {
    console.log('email change not implemented');
  },

  updatePassword: function(userId, password) {
    const url = 'api/putUser.php';
    const submitData = {
      userId: userId,
      password: password
    };
    utils.postAsync(url, submitData, function(response) {
      const responseData = JSON.parse(response, true);
      if (!responseData.resultCode || (responseData.resultCode !== '200')) {
        console.log('Got response ' + response);
      }
    });
  }
};

export default UserAction;
