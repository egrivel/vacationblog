'use strict';

const React = require('react');
const Link = require('react-router').Link;

const storeMixin = require('./StoreMixin');

const FacebookAction = require('../actions/FacebookAction');
const LoginAction = require('../actions/LoginAction');
const FacebookStore = require('../stores/FacebookStore');
const UserStore = require('../stores/UserStore');

// The FacebookWrapper component handles the facebook interactions...
const FacebookWrapper = React.createClass({
  mixins: [storeMixin()],

  stores: [UserStore, FacebookStore],

  _getStateFromStores: function() {
    const status = FacebookStore.getStatus();
    const name = FacebookStore.getName();
    const email = FacebookStore.getEmail();;
    const loginErrorMessage = UserStore.getFormErrorMessage();

    return {
      email: email,
      loginErrorMessage: loginErrorMessage,
      name: name,
      status: status
    };
  },

  _statusChange: function(statusResponse) {
    if (statusResponse.status === 'connected') {
      FacebookAction.loadDetails();
    } else {
      FacebookAction.unloadDetails();
      const userId = UserStore.getLoggedInUser();
      const userData = UserStore.getData(userId);
      if (userData && userData.externalType === 'facebook') {
        // user is logged in as a facebook user, but facebook is no longer
        // connected. Log the user out from our system.
        LoginAction.doLogout();
      }
    }
  },

  componentDidMount: function() {
    if (window.FB) {
      window.FB.Event.subscribe('auth.statusChange', this._statusChange);
      FacebookAction.setAvailable(true);
    } else {
      FacebookAction.setAvailable(false);
    }

    if (FacebookStore.isAvailable()) {
      const status = FacebookStore.getStatus();

      if (!status) {
        FacebookAction.getStatus();
      }
    }
  },

  componentDidUpdate: function() {
    const fbEmail = FacebookStore.getEmail();
    const fbId = FacebookStore.getId();
    const fbName = FacebookStore.getName();
    const fbStatus = FacebookStore.getStatus();
    const isUserLoggedIn = UserStore.isUserLoggedIn();
    const userId = UserStore.getLoggedInUser();
    const userData = UserStore.getData(userId);

    if (FacebookStore.isAvailable()) {
      if (!fbStatus) {
        FacebookAction.getStatus();
      } else if (fbStatus === 'connected' && !fbName) {
        FacebookAction.loadDetails();
      } else if (fbStatus === 'connected' && !userData) {
        // We have a facebook user who is logged in, make them login to
        // the app...
        LoginAction.doFacebookLogin(fbId, fbName, fbEmail);
      } else if (fbStatus !== 'connected' && userData && userData.externalType === 'facebook') {
        // user is logged in as a facebook user, but facebook is no longer
        // connected. Log the user out from our system.
        LoginAction.doLogout();
      }
    }
  },

  render: function() {
    // The component doesn't actually display anything
    return null;
  }
});

module.exports = FacebookWrapper;
