'use strict';

var React = require('react');

// Declare the menu list so that it can be used in the MenuItem declaration
var MenuList;

var MenuItem = React.createClass({
  displayName: 'MenuItem',

  propTypes: {
    id: React.PropTypes.string.isRequired,
    handleHover: React.PropTypes.func.isRequired,
    handleSelect: React.PropTypes.func,
    submenu: React.PropTypes.array,
    className: React.PropTypes.string,
    selected: React.PropTypes.bool,
    target: React.PropTypes.string,
    visible: React.PropTypes.bool,
    label: React.PropTypes.string
  },

  mouseOver: function() {
    this.props.handleHover(this.props.id, true);
  },
  mouseOut: function() {
    this.props.handleHover(this.props.id, false);
  },
  click: function() {
    if (!this.props.submenu) {
      // select only if this is a leaf item
      this.props.handleSelect(this.props.id, this.props.target);
    }
    this.props.handleHover(this.props.id, !this.props.visible);
  },
  render: function() {
    var submenu = null;
    var className = this.props.className;
    if (this.props.selected) {
      className += ' selected';
    }
    if (this.props.submenu && this.props.visible) {
      submenu = React.createElement(
        MenuList,
        {
          list: this.props.submenu,
          handleSelect: this.props.handleSelect,
          handleHover: this.props.handleHover
        }
      );
    }
    var childNode;
    if (this.props.target) {
      childNode = React.DOM.a(
        {
          href: this.props.target
        },
        this.props.label);
    } else {
      childNode = this.props.label;
      className += ' nolink';
    }
    return React.DOM.li(
      {
        onMouseOver: this.mouseOver,
        onMouseOut: this.mouseOut,
        onClick: this.click,
        className: className
      },
      childNode,
      submenu
    );
  }
});

MenuList = React.createClass({
  displayName: 'MenuList',

  propTypes: {
    topLevel: React.PropTypes.bool,
    list: React.PropTypes.array,
    handleHover: React.PropTypes.func,
    handleSelect: React.PropTypes.func
  },

  render: function() {
    var children = [];
    var childCount = 0;

    var attribs = {};
    var extraClassName = '';
    if (this.props.topLevel) {
      attribs.className = 'main-menu';
      extraClassName = 'first';
    }

    var i;
    if (this.props.list) {
      for (i = 0; this.props.list[i]; i++) {
        children[childCount++] = React.createElement(MenuItem, {
          id: this.props.list[i].id,
          className: extraClassName,
          key: this.props.list[i].id,
          label: this.props.list[i].label,
          selected: this.props.list[i].selected,
          target: this.props.list[i].target,
          submenu: this.props.list[i].submenu,
          visible: this.props.list[i].visible,
          handleHover: this.props.handleHover,
          handleSelect: this.props.handleSelect
        });
        extraClassName = '';
      }
    }

    return (React.DOM.ul(attribs, children));
  }
});

module.exports = MenuList;
