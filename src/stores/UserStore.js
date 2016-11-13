'use strict';

var _ = require('lodash');
var assign = require('object-assign');

var GenericStore = require('./GenericStore');
var AppDispatcher = require('../AppDispatcher');
var UserActionTypes = require('../actions/UserAction').Types;

var UserStore;

var _userData = {};
var _userLoggedIn = '';
var _formStatus = '';
var _formErrorMessage = '';
var _userList = [];

UserStore = assign({}, GenericStore, {
  constants: {
    NONE: 'NONE',
    LOGIN_CLEAR: 'LOGIN_CLEAR',
    LOGIN_ERROR: 'LOGIN_ERROR',
    LOGOUT: 'LOGOUT'
  },

  _reset: function() {
    _userData = {};
    _userList = [];
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
      var user = _userData[_userLoggedIn];
      if (user && user.access) {
        return user.access;
      }
    }
    return '';
  },

  getFormStatus: function() {
    return _formStatus;
  },

  getFormErrorMessage: function() {
    return _formErrorMessage;
  },

  getUserList: function() {
    return _userList;
  },

  _storeCallback: function(action) {
    switch (action.type) {
      case UserActionTypes.USER_SET_DATA:
        var userId = action.data.userId;
        if (!_userData[userId] || !_.isEqual(action.data, _userData[userId])) {
          _userData[userId] = action.data;
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LOGGED_IN:
        if (_userLoggedIn !== action.userId) {
          _userLoggedIn = action.userId;
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LOGIN_FORM_STATUS:
        if (_formStatus !== action.status) {
          _formStatus = action.status;
          if (_formStatus !== UserStore.constants.LOGIN_ERROR) {
            _formErrorMessage = '';
          }
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LOGIN_FORM_ERROR:
        if (_formErrorMessage !== action.message) {
          _formErrorMessage = action.message;
          if (_formErrorMessage) {
            _formStatus = UserStore.constants.LOGIN_ERROR;
          }
          UserStore.emitChange();
        }
        break;
      case UserActionTypes.USER_SET_LIST:
        _userList = action.list;
        UserStore.emitChange();
        break;
      default:
        // do nothing
        break;
    }
  }
});

_formStatus = UserStore.constants.NONE;

UserStore.dispatchToken = AppDispatcher.register(UserStore._storeCallback);

// The feedback component listens to the user store, and there can be a *lot*
// of feedback components on the page, so increase the number of listeners
// allowed.
UserStore.setMaxListeners(100);

module.exports = UserStore;
