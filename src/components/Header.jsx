'use strict';

import React from 'react';
import createReactClass from 'create-react-class';

import Menu from './Menu';
import Login from './Login';
import TripStore from '../stores/TripStore';
import MenuStore from '../stores/MenuStore';
import UserStore from '../stores/UserStore';
import UserAction from '../actions/UserAction';

import storeMixin from './StoreMixin';

const Header = createReactClass({
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
    let isFacebookUser = false;
    if (userId) {
      const data = UserStore.getData(userId);
      if (data && data.name) {
        loginDisplay = data.name;
        if (data.externalType === 'facebook') {
          isFacebookUser = true;
        }
      }
    }
    const loginState = UserStore.getLoginState();
    const loginErrorMessage = UserStore.getFormErrorMessage();

    const menuData = MenuStore.getData();

    return {
      name: name,
      bannerImg: img,
      loginDisplay: loginDisplay,
      isFacebookUser: isFacebookUser,
      isUserLoggedIn: isUserLoggedIn,
      loginState: loginState,
      loginErrorMessage: loginErrorMessage,
      menuData: menuData
    };
  },

  render: function() {
    let banner;
    if (this.state.bannerImg) {
      banner = <img src={'media/' + this.state.bannerImg}/>;
    } else {
      banner = (
        <div className="dummy-banner">
          <span>trip banner image is missing</span>
        </div>
      );
    }

    let userForm = null;
    if (this.state.loginState !== UserStore.constants.NONE) {
      userForm = (
        <Login errorMessage={this.state.loginErrorMessage}
            onClose={this._onLoginClose}/>
      );
    }

    let icon = 'fa-sign-in';
    if (this.state.isUserLoggedIn) {
      icon = 'fa-user';
      if (this.state.isFacebookUser) {
        icon = 'fa-facebook-square';
      }
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

export default Header;
