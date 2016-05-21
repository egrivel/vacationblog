'use strict';

var React = require('react');
var Menu = require('./Menu');
var Login = require('./Login.jsx');
var Logout = require('./Logout.jsx');
var TripStore = require('../stores/TripStore');
var MenuStore = require('../stores/MenuStore');
var UserStore = require('../stores/UserStore');

var storeMixin = require('./StoreMixin');

var Header = React.createClass({
  displayName: 'Header',

  stores: [TripStore, MenuStore, UserStore],

  mixins: [storeMixin()],

  _doUserClick: function() {
    if (this.state.userName === 'Login') {
      if (this.state.showLogin) {
        this.setState({showLogin: false});
      } else {
        this.setState({showLogin: true});
      }
    } else if (this.state.showLogout) {
      this.setState({showLogout: false});
    } else {
      this.setState({showLogout: true});
    }
  },

  _onLoginClose: function() {
    this.setState({showLogin: false});
  },

  _onLogoutClose: function() {
    this.setState({showLogout: false});
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
    return {
      name: name,
      bannerImg: img,
      menuData: MenuStore.getData(),
      userName: userName
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
    if (this.state.showLogin) {
      userForm = <Login onClose={this._onLoginClose}/>;
    } else if (this.state.showLogout) {
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
