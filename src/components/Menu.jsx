'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const MenuList = require('./MenuList.jsx');

const Menu = createReactClass({
  displayName: 'Menu',

  propTypes: {
    menuData: PropTypes.array
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
