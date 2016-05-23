'use strict';

var React = require('react');
var Menu = require('./Menu');
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
    if (this.state.userName === 'Login') {
      if (this.state.loginStatus === UserStore.constants.NONE) {
        UserAction.setLoginFormStatus(UserStore.constants.LOGIN_CLEAR);
      } else {
        UserAction.setLoginFormStatus(UserStore.constants.NONE);
      }
    } else {
      if (this.state.loginStatus === UserStore.constants.LOGOUT) {
        UserAction.setLoginFormStatus(UserStore.constants.NONE);
      } else {
        UserAction.setLoginFormStatus(UserStore.constants.LOGOUT);
      }
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
    var tripData = TripStore.getTripData();
    var name = tripData.name;
    var img = tripData.bannerImg;
    if (!name) {
      name = 'Vacation Website';
      img = 'default-banner.png';
    }
    var userId = UserStore.getLoggedInUser();
    var userName = 'Login';
    if (userId) {
      var data = UserStore.getData(userId);
      if (data && data.name) {
        userName = data.name;
      }
    }
    var loginStatus = UserStore.getFormStatus();
    var loginErrorMessage = UserStore.getFormErrorMessage();
    return {
      name: name,
      bannerImg: img,
      menuData: MenuStore.getData(),
      userName: userName,
      loginStatus: loginStatus,
      loginErrorMessage: loginErrorMessage
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
    var icon = 'fa-user';
    if (this.state.userName === 'Login') {
      icon = 'fa-sign-in';
    }
    return (
      <div className="header">
        <h1>{this.state.name}</h1>
        <span className="userName">
          <a className="login-link" onClick={this._doUserClick}>
            {this.state.userName}
            &nbsp;
            <i className={'fa ' + icon}></i>
          </a>
          {userForm}
        </span>
        {banner}
        <Menu menuData={this.state.menuData}/>
      </div>
    );
  }
});

module.exports = Header;
