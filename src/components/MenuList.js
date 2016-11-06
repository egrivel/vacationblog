'use strict';

var React = require('react');

var MenuList = React.createClass({
  displayName: 'MenuList',

  propTypes: {
    topLevel: React.PropTypes.bool,
    list: React.PropTypes.array,
    handleHover: React.PropTypes.func,
    handleSelect: React.PropTypes.func
  },

  render: function() {
    var children = [];

    var attribs = {};
    if (this.props.topLevel) {
      attribs.className = 'main-menu';
    }

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

    return (React.DOM.ul(attribs, children));
  }
});

module.exports = MenuList;
