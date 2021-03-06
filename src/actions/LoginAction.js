import UserStore from '../stores/UserStore';
import cookieUtils from '../utils';

import UserAction from './UserAction';
import utils from './utils';

const LoginAction = {
  _doLoginCallback: (response) => {
    const data = JSON.parse(response);
    if (data.resultCode === '200') {
      const authId = data.authId;
      if (authId) {
        if (LoginAction.stayLoggedIn) {
          cookieUtils.setCookie(cookieUtils.cookies.AUTH, authId, 1000);
        } else {
          cookieUtils.setCookie(cookieUtils.cookies.AUTH, authId);
        }
      } else {
        cookieUtils.eraseCookie(cookieUtils.cookies.AUTH);
      }

      if (data.userId) {
        if (data.userId === 'j.tong') {
          // Login is success, give a message but remove after few seconds
          setTimeout(() => {
            UserAction.setLoginState(UserStore.constants.NONE);
          }, 4000);
          UserAction.setLoginState(UserStore.constants.LOGIN_SUCCESS);
        } else {
          // Other users do not get a message at all
          UserAction.setLoginState(UserStore.constants.NONE);
        }
        UserAction.setLoggedInUser(data.userId);
        UserAction.loadUser(data.userId);
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
      UserAction.setTempCode(LoginAction.userId, data.tempCode);
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

  // eslint-disable-next-line complexity
  _doConfirmRegCallback: (response) => {
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
    } else if (LoginAction.userId && LoginAction.password) {
      LoginAction.doLogin(LoginAction.userId, LoginAction.password);
    } else {
      UserAction.setLoginState(UserStore.constants.LOGIN);
      UserAction.setLoginFormError(
        'Your registration is confirmed. Please log in for the first time.');
    }
  },

  // eslint-disable-next-line complexity
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
      LoginAction.doLogin(LoginAction.userId, LoginAction.password);
    }
  },

  doLogin: function(userId, password, stayLoggedIn) {
    const url = 'api/login.php';
    const data = {
      action: 'login',
      userId: userId,
      password: password
    };
    LoginAction.userId = userId;
    LoginAction.stayLoggedIn = stayLoggedIn;
    utils.postAsync(url, data, LoginAction._doLoginCallback.bind(this));
  },

  doFacebookLogin: function(fbUserId, fbName, fbEmail) {
    // Internal user ID has 'fb ' prepended to the facebook ID, which
    // is not an ID that anyone can enter
    const userId = 'fb ' + fbUserId;
    const url = 'api/login.php';
    const data = {
      action: 'fb-login',
      userId: userId,
      name: fbName,
      email: fbEmail
    };
    LoginAction.userId = userId;
    // facebook users never stay logged in; when they come back, they
    // are auto-logged-in if they're still logged into facebook.
    LoginAction.stayLoggedIn = false;
    utils.postAsync(url, data, LoginAction._doLoginCallback.bind(this));
  },

  doLogout: function() {
    const url = 'api/logout.php';
    LoginAction.userId = '';
    utils.getAsync(url, LoginAction._doLoginCallback.bind(this));
  },

  // eslint-disable-next-line max-params
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
    LoginAction.userId = userId;
    utils.postAsync(url, data, LoginAction._doRegisterCallback.bind(this));
  },

  doRetrieve: function(userId, email) {
    const url = 'api/login.php';
    const data = {
      action: 'retrieve',
      userId: userId,
      email: email
    };
    LoginAction.userId = userId;
    LoginAction.email = email;
    utils.postAsync(url, data, LoginAction._doRetrieveCallback.bind(this));
  },

  doConfirmReg: function(userId, confCode, password) {
    const url = 'api/login.php';
    const data = {
      action: 'confirm',
      userId: userId,
      confCode: confCode
    };
    LoginAction.userId = userId;
    LoginAction.password = password;
    utils.postAsync(url, data, LoginAction._doConfirmRegCallback.bind(this));
  },

  doConfirmPwd: function(userId, confCode, password) {
    const url = 'api/login.php';
    const data = {
      action: 'confirm-pwd',
      userId: userId,
      confCode: confCode,
      password: password
    };
    LoginAction.userId = userId;
    LoginAction.password = password;
    utils.postAsync(url, data, LoginAction._doConfirmPwdCallback.bind(this));
  }
};

export default LoginAction;
