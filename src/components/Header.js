'use strict';

var React = require('react');
var Menu = require('./Menu');
var TripStore = require('../stores/TripStore');
var MenuStore = require('../stores/MenuStore');
var UserStore = require('../stores/UserStore');

var storeMixin = require('./StoreMixin');

var Header = React.createClass({
  displayName: 'Header',

  stores: [TripStore, MenuStore, UserStore],

  mixins: [storeMixin()],

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
    var userName = '(not logged in)';
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
      banner = React.DOM.img(
        {
          src: 'media/' + this.state.bannerImg
        });
    } else {
      banner = React.DOM.div(
        {
          className: 'dummy-banner'
        },
        React.DOM.span(null, 'trip banner image is missing')
      );
    }
    return (
      React.DOM.div(
        {
          className: 'header'
        },
        React.DOM.h1(null, this.state.name),
        React.DOM.span({className: 'userName'}, this.state.userName),
        banner,
        React.createElement(Menu, {menuData: this.state.menuData})
      )
    );
  }
});

module.exports = Header;
