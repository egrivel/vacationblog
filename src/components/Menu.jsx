'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import MenuList from './MenuList';

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

export default Menu;
