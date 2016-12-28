'use strict';

const React = require('react');
const MenuList = require('./MenuList.jsx');

const Menu = React.createClass({
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
