'use strict';

const _ = require('lodash');
const assign = require('object-assign');

const GenericStore = require('./GenericStore');
const AppDispatcher = require('../AppDispatcher');
const UserActionTypes = require('../actions/UserAction').Types;

let _userData = {};
let _userEditData = {};
let _userLoggedIn = '';
let _loginState = '';
let _formErrorMessage = '';
let _userList = [];

const UserStore = assign({}, GenericStore, {
  // Set of defined login states
  constants: {
    NONE: 'NONE',
    LOGIN: 'LOGIN',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    REGISTER: 'REGISTER',
    RETRIEVE: 'RETRIEVE',
    CONFIRM_REG: 'CONFIRM_REG',
    CONFIRM_PWD: 'CONFIRM_PWD',
    LOGOUT: 'LOGOUT'
  },

  _reset: function() {
    _userData = {};
    _userEditData = {};
    _userList = [];
  },

  /**
   * Obtain all the information of the user item.
   * @param {id} userId - ID of the user whose data is requested.
   * @return {object} Data for the requested user.
   */
  getData: function(userId) {
    const data = _userData[userId];
    return data;
  },

  getEditData: function(userId) {
    if (_userEditData[userId]) {
      return _userEditData[userId];
    }
    if (_userData[userId]) {
      return _userData[userId];
    }
    return {};
  },

  getLoggedInUser: function() {
    if (_userLoggedIn) {
      return _userLoggedIn;
    }
    return '';
  },

  isUserLoggedIn: function() {
    return (_userLoggedIn && (_userLoggedIn !== ''));
  },

  /**
   * Determine if the user can add a comment. This is a convenience function,
   * as currently all logged in users can add comments. In the future, it
   * may be possible to inspect a user's abilities to determine whether they
   * can add a comment.
   * @return {Boolean} whether user can add a comment.
   */
  canAddComment: function() {
    return (_userLoggedIn && (_userLoggedIn !== ''));
  },

  getAccess: function() {
    if (_userLoggedIn) {
      const user = _userData[_userLoggedIn];
      if (user && user.access) {
        return user.access;
      }
    }
    return '';
  },

  getLoginState: function() {
    return _loginState;
  },

  getFormErrorMessage: function() {
    return _formErrorMessage;
  },

  getUserList: function() {
    return _userList;
  },

  _storeCallback: function(action) {
    let userId;
    switch (action.type) {
      case UserActionTypes.USER_SET_DATA:
        userId = action.data.userId;
        if (!_userData[userId] || !_.isEqual(action.data, _userData[userId])) {
          _userData[userId] = action.data;
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_TEMP_CODE:
        userId = action.userId;
        if (!_userData[userId]) {
          _userData[userId] = {};
        }
        _userData[userId].tempCode = action.tempCode;
        UserStore.emitChange();
        break;
      case UserActionTypes.USER_SET_LOGGED_IN:
        if (_userLoggedIn !== action.userId) {
          _userLoggedIn = action.userId;
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LOGIN_LOGIN_STATE:
        if (_loginState !== action.state) {
          _loginState = action.state;
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LOGIN_FORM_ERROR:
        if (_formErrorMessage !== action.message) {
          _formErrorMessage = action.message;
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LIST:
        _userList = action.list;
        UserStore.emitChange();
        break;
      case UserActionTypes.USER_INIT_EDIT:
        _userEditData[action.userId] = _.cloneDeep(_userData[action.userId]);
        UserStore.emitChange();
        break;
      case UserActionTypes.USER_SET_EDIT:
        if (!_userEditData[action.userId]) {
          _userEditData[action.userId] = _.cloneDeep(_userData[action.userId]);
        }
        _userEditData[action.userId][action.prop] = action.value;
        UserStore.emitChange();
        break;
      case UserActionTypes.USER_CLEAR_EDIT:
        _userEditData[action.userId] = {};
        UserStore.emitChange();
        break;
      default:
        // do nothing
        break;
    }
  }
});

_loginState = UserStore.constants.NONE;

UserStore.dispatchToken = AppDispatcher.register(UserStore._storeCallback);

// The feedback component listens to the user store, and there can be a *lot*
// of feedback components on the page, so increase the number of listeners
// allowed.
UserStore.setMaxListeners(100);

module.exports = UserStore;
