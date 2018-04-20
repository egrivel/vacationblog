'use strict';

const UserAction = require('./UserAction');
const UserStore = require('../stores/UserStore');
const utils = require('./utils');
const cookieUtils = require('../utils');

const LoginAction = {
  _doLoginCallback: function(response) {
    const data = JSON.parse(response);
    if (data.resultCode === '200') {
      const authId = data.authId;
      if (authId) {
        if (this.stayLoggedIn) {
          cookieUtils.setCookie(cookieUtils.cookies.AUTH, authId, 1000);
        } else {
          cookieUtils.setCookie(cookieUtils.cookies.AUTH, authId);
        }
      } else {
        cookieUtils.eraseCookie(cookieUtils.cookies.AUTH);
      }

      if (data.userId) {
        if (data.userId === 'j.tong') {
          UserAction.setLoginState(UserStore.constants.LOGIN_SUCCESS);
          UserAction.setLoggedInUser(data.userId);
          UserAction.loadUser(data.userId);
          // Login is success, but remove the message after a few seconds
          setTimeout(function() {
            UserAction.setLoginState(UserStore.constants.NONE);
          }, 4000);
        } else {
          UserAction.setLoginState(UserStore.constants.NONE);
          UserAction.setLoggedInUser(data.userId);
          UserAction.loadUser(data.userId);
        }
      } else {
        UserAction.setLoggedInUser('');
      }
    } else if (data.status === 'TEMP_USER') {
      UserAction.setLoginState(UserStore.constants.CONFIRM_REG);
      UserAction.setLoginFormError(
        'You cannot log in until you have confirmed your email address.');
    } else {
      UserAction.setLoginFormError(
        'Please check the information you entered. Both user ID and password ' +
        'are case-sensitive!');
    }
  },

  _doRegisterCallback: function(response) {
    const data = JSON.parse(response);
    // Default error message in case something happened that
    // isn't handled below
    let errorMessage = 'Something went wrong...';
    if (data && data.status) {
      if (data.status === 'USERID_EXISTS') {
        errorMessage = 'A user with this ID already exists. ' +
          'Please select a different user ID.';
      } else if (data.status === 'EMAIL_EXISTS') {
        errorMessage = 'This email is already in use. If this ' +
          'is your email address, you may already be registered ' +
          'to this website; please use the function to retrieve ' +
          'your login information.';
      } else if (data.status === 'OK') {
        errorMessage = '';
      } else {
        errorMessage = 'Unknown response code ' + data.status;
      }
    }

    if (errorMessage) {
      UserAction.setLoginFormError(errorMessage);
    } else {
      UserAction.setTempCode(this.userId, data.tempCode);
      UserAction.setLoginState(UserStore.constants.CONFIRM_REG);
    }
  },

  _doRetrieveCallback: function(response) {
    const data = JSON.parse(response);
    // Default error message in case something happened that
    // isn't handled below
    let errorMessage = 'Something went wrong...';
    if (data && data.status) {
      if ((data.status === 'MISSING_DATA') ||
        (data.status === 'USERID_NOT_FOUND')) {
        errorMessage = 'Please check the information you entered.';
      } else if (data.status === 'OK') {
        errorMessage = '';
      }
    }

    if (errorMessage) {
      UserAction.setLoginFormError(errorMessage);
    } else {
      // user is asking for the password reset
      // function. Bring them to the password reset confirmation page
      UserAction.setLoginState(UserStore.constants.CONFIRM_PWD);
    }
  },

  _doConfirmRegCallback: function(response) {
    const data = JSON.parse(response);
    let errorMessage = 'Something went wrong...';
    if (data && data.status) {
      if (data.status === 'MISSING_DATA') {
        errorMessage = 'Please enter both user name and confirmation code.';
      } else if (data.status === 'USERID_NOT_FOUND') {
        errorMessage = 'Please check the information you entered.';
      } else if (data.status === 'CONF_MISMATCH') {
        errorMessage =
        'Please check the information you entered. A confirmation code can ' +
        'only be used once.';
      } else if (data.status === 'OK') {
        errorMessage = '';
      } else {
        errorMessage = 'Unknown response code ' + data.status;
      }
    }
    if (errorMessage) {
      UserAction.setLoginFormError(errorMessage);
    } else if (this.userId && this.password) {
      this.doLogin(this.userId, this.password);
    } else {
      UserAction.setLoginState(UserStore.constants.LOGIN);
      UserAction.setLoginFormError(
        'Your registration is confirmed. Please log in for the first time.');
    }
  },

  _doConfirmPwdCallback: function(response) {
    const data = JSON.parse(response);
    let errorMessage = 'Something went wrong...';
    if (data && data.status) {
      if ((data.status === 'MISSING_DATA') ||
        (data.status === 'USERID_NOT_FOUND') ||
        (data.status === 'CONF_MISMATCH')) {
        errorMessage = 'Please check the information you entered.';
      } else if (data.status === 'TEMP_USER') {
        errorMessage =
          'You need to confirm registration before you can reset your ' +
          'password.';
      } else if (data.status === 'OK') {
        errorMessage = '';
      }
    }
    if (errorMessage) {
      UserAction.setLoginFormError(errorMessage);
    } else {
      UserAction.setLoginState(UserStore.constants.NONE);
      LoginAction.doLogin(this.userId, this.password);
    }
  },

  doLogin: function(userId, password, stayLoggedIn) {
    const url = 'api/login.php';
    const data = {
      action: 'login',
      userId: userId,
      password: password
    };
    this.userId = userId;
    this.stayLoggedIn = stayLoggedIn;
    utils.postAsync(url, data, this._doLoginCallback.bind(this));
  },

  doLogout: function() {
    const url = 'api/logout.php';
    this.userId = '';
    utils.getAsync(url, this._doLoginCallback.bind(this));
  },

  doRegister: function(userId, name, email, password, notification) {
    const url = 'api/login.php';
    const data = {
      action: 'register',
      userId: userId,
      name: name,
      email: email,
      password: password,
      notification: notification ? 'Y' : 'N'
    };
    this.userId = userId;
    utils.postAsync(url, data, this._doRegisterCallback.bind(this));
  },

  doRetrieve: function(userId, email) {
    const url = 'api/login.php';
    const data = {
      action: 'retrieve',
      userId: userId,
      email: email
    };
    this.userId = userId;
    this.email = email;
    utils.postAsync(url, data, this._doRetrieveCallback.bind(this));
  },

  doConfirmReg: function(userId, confCode, password) {
    const url = 'api/login.php';
    const data = {
      action: 'confirm',
      userId: userId,
      confCode: confCode
    };
    this.userId = userId;
    this.password = password;
    utils.postAsync(url, data, this._doConfirmRegCallback.bind(this));
  },

  doConfirmPwd: function(userId, confCode, password) {
    const url = 'api/login.php';
    const data = {
      action: 'confirm-pwd',
      userId: userId,
      confCode: confCode,
      password: password
    };
    this.userId = userId;
    this.password = password;
    utils.postAsync(url, data, this._doConfirmPwdCallback.bind(this));
  }
};

module.exports = LoginAction;
