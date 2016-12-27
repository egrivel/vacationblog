'use strict';

const React = require('react');

const MenuList = React.createClass({
  displayName: 'MenuList',

  propTypes: {
    list: React.PropTypes.array
  },

  render: function() {
    const children = [];

    if (this.props.list) {
      for (let i = 0; this.props.list[i]; i++) {
        if (this.props.list[i].visible) {
          let className = null;
          if (this.props.list[i].selected) {
            className = 'selected';
          }
          children.push(
            <li key={this.props.list[i].id} className={className}>
              <a href={this.props.list[i].target}>
                {this.props.list[i].label}
              </a>
            </li>
          );
        }
      }
    }

    return (
      <ul className="main-menu">
        {children}
      </ul>
    );
  }
});

module.exports = MenuList;
