'use strict';

var React = require('react');

var MenuList = React.createClass({
  displayName: 'MenuList',

  propTypes: {
    list: React.PropTypes.array
  },

  render: function() {
    var children = [];

    var i;
    if (this.props.list) {
      for (i = 0; this.props.list[i]; i++) {
        if (this.props.list[i].visible) {
          children.push(
            <li key={this.props.list[i].id}>
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
