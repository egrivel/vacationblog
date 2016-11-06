'use strict';

var React = require('react');
var MenuList = require('./MenuList');

var Menu = React.createClass({
  displayName: 'Menu',

  propTypes: {
    menuData: React.PropTypes.array
  },

  render: function() {
    return (
      <div>
        <MenuList list={this.props.menuData} />
        <div className="clear"></div>
      </div>
    );
  }
});

module.exports = Menu;
