'use strict';

// Add 'window' to the eslint globals for this file.
/* global window */

var React = require('react');
var History = require('react-router').History;
var MenuAction = require('../actions/MenuAction');
var MenuList = require('./MenuList');

var inHover = false;

var Menu = React.createClass({
  displayName: 'Menu',

  mixins: [History],

  handleSelect: function(id, target) {
    // console.log('Selected item ' + id + ', target=' + target);
    MenuAction.selectItem(id);
    // MenuAction.visibleItem(id, false);
    window.location.href = target;
  },

  handleHover: function(id, hover) {
    inHover = hover;
    if (hover) {
      // turn hover on immediately
      MenuAction.visibleItem(id, hover);
    } else {
      // turn off menu's visibility after 1/10th of a second, but only if
      // at that time the inHover is still false.
      setTimeout(function() {
        if (!inHover) {
          MenuAction.visibleItem(id, hover);
        }
      }, 100);
    }
  },

  render: function() {
    return (
      React.DOM.div(null,
        React.createElement(
          MenuList,
          {
            list: this.props.menuData,
            topLevel: true,
            handleSelect: this.handleSelect,
            handleHover: this.handleHover
          }
        ),
        React.DOM.div({className: 'clear'}, null)
      )
    );
  }
});

module.exports = Menu;

