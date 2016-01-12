'use strict';

var React = require('react');
var Menu = require('./Menu');
var TripStore = require('../stores/TripStore');
var MenuStore = require('../stores/MenuStore');

var storeMixin = require('./StoreMixin');

var Header = React.createClass({
  displayName: 'Header',

  stores: [TripStore, MenuStore],

  mixins: [storeMixin()],

  /**
   * Get the state from the stores.
   * @return {object} new state.
   * @private
   */
  _getStateFromStores: function _getStateFromStores() {
    var tripData = TripStore.getTripData();
    var name = tripData.name;
    if (!name) {
      name = 'Vacation Website';
    }
    return {
      name: name,
      bannerImg: tripData.bannerImg,
      menuData: MenuStore.getData()
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
        banner,
        React.createElement(Menu, {menuData: this.state.menuData})
      )
    );
  }
});

module.exports = Header;
