'use strict';

var React = require('react');
var Menu = require('./Menu.jsx');
var Login = require('./Login.jsx');
var Logout = require('./Logout.jsx');
var TripStore = require('../stores/TripStore');
var MenuStore = require('../stores/MenuStore');
var UserStore = require('../stores/UserStore');
var UserAction = require('../actions/UserAction');

var storeMixin = require('./StoreMixin');

var Header = React.createClass({
  displayName: 'Header',

  stores: [TripStore, MenuStore, UserStore],

  mixins: [storeMixin()],

  _doUserClick: function() {
    if (!this.state.isUserLoggedIn) {
      if (this.state.loginStatus === UserStore.constants.NONE) {
        UserAction.setLoginFormStatus(UserStore.constants.LOGIN_CLEAR);
      } else {
        UserAction.setLoginFormStatus(UserStore.constants.NONE);
      }
    } else if (this.state.loginStatus === UserStore.constants.LOGOUT) {
      UserAction.setLoginFormStatus(UserStore.constants.NONE);
    } else {
      UserAction.setLoginFormStatus(UserStore.constants.LOGOUT);
    }
  },

  _onLoginClose: function() {
    UserAction.setLoginFormStatus(UserStore.constants.NONE);
  },

  _onLogoutClose: function() {
    UserAction.setLoginFormStatus(UserStore.constants.NONE);
  },

  /**
   * Get the state from the stores.
   * @return {object} new state.
   * @private
   */
  _getStateFromStores: function _getStateFromStores() {
    const tripData = TripStore.getTripData();
    let name = tripData.name;
    let img = tripData.bannerImg;
    if (!name) {
      name = 'Vacation Website';
      img = 'default-banner.png';
    }

    const userId = UserStore.getLoggedInUser();
    const isUserLoggedIn = (userId !== '');
    let loginDisplay = 'Login';
    if (userId) {
      const data = UserStore.getData(userId);
      if (data && data.name) {
        loginDisplay = data.name;
      }
    }
    const loginStatus = UserStore.getFormStatus();
    const loginErrorMessage = UserStore.getFormErrorMessage();

    const menuData = MenuStore.getData();

    return {
      name: name,
      bannerImg: img,
      loginDisplay: loginDisplay,
      isUserLoggedIn: isUserLoggedIn,
      loginStatus: loginStatus,
      loginErrorMessage: loginErrorMessage,
      menuData: menuData
    };
  },

  render: function() {
    var banner;
    if (this.state.bannerImg) {
      banner = <img src={'media/' + this.state.bannerImg}/>;
    } else {
      banner = (
        <div className="dummy-banner">
          <span>trip banner image is missing</span>
        </div>
      );
    }
    var userForm = null;
    if ((this.state.loginStatus === UserStore.constants.LOGIN_CLEAR) ||
        (this.state.loginStatus === UserStore.constants.LOGIN_ERROR)) {
      userForm = (
        <Login errorMessage={this.state.loginErrorMessage}
            onClose={this._onLoginClose}/>
      );
    } else if (this.state.loginStatus === UserStore.constants.LOGOUT) {
      userForm = <Logout onClose={this._onLogoutClose}/>;
    }
    var icon = 'fa-sign-in';
    if (this.state.isUserLoggedIn) {
      icon = 'fa-user';
    }
    return (
      <div className="header">
        <span className="userName">
          <a className="login-link" onClick={this._doUserClick}>
            {this.state.loginDisplay}
            &nbsp;
            <i className={'fa ' + icon}></i>
          </a>
          {userForm}
        </span>
        <h1>{this.state.name}</h1>
        {banner}
        <Menu menuData={this.state.menuData}/>
      </div>
    );
  }
});

module.exports = Header;
