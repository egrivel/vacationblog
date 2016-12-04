'use strict';

var React = require('react');
var Menu = require('./Menu.jsx');
var Login = require('./Login.jsx');
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
    if (this.state.isUserLoggedIn) {
      UserAction.setLoginState(UserStore.constants.LOGOUT);
    } else {
      UserAction.setLoginState(UserStore.constants.LOGIN);
    }
  },

  _onLoginClose: function() {
    UserAction.setLoginState(UserStore.constants.NONE);
    UserAction.setLoginFormError('');
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
    let loginDisplay = 'Login or Register';
    if (userId) {
      const data = UserStore.getData(userId);
      if (data && data.name) {
        loginDisplay = data.name;
      }
    }
    const loginState = UserStore.getLoginState();
    const loginErrorMessage = UserStore.getFormErrorMessage();

    const menuData = MenuStore.getData();

    return {
      name: name,
      bannerImg: img,
      loginDisplay: loginDisplay,
      isUserLoggedIn: isUserLoggedIn,
      loginState: loginState,
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
    if (this.state.loginState !== UserStore.constants.NONE) {
      userForm = (
        <Login errorMessage={this.state.loginErrorMessage}
            onClose={this._onLoginClose}/>
      );
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
