'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const MenuList = createReactClass({
  displayName: 'MenuList',

  propTypes: {
    list: PropTypes.array
  },

  getInitialState: function() {
    return {open: false};
  },

  _openMenu: function(event) {
    this.setState({open: !this.state.open});
    // event.stopPropagation();
    event.preventDefault();
  },

  _selectMenu: function(event) {
    this.setState({open: false});
    // Note: in this case we WANT the default to happen...
  },

  render: function() {
    const children = [];
    let selectedName = '';

    if (this.props.list) {
      for (let i = 0; this.props.list[i]; i++) {
        if (this.props.list[i].visible) {
          let className = null;
          if (this.props.list[i].selected) {
            className = 'selected';
            selectedName = this.props.list[i].label;
          }
          children.push(
            <li key={this.props.list[i].id} className={className}>
              <a href={this.props.list[i].target} onClick={this._selectMenu}>
                {this.props.list[i].label}
              </a>
            </li>
          );
        }
      }
    }

    let className = 'main-menu';
    if (this.state.open) {
      className += ' main-menu-open';
    }

    return (
      <ul className={className}>
        <li className="icon">
          <a href="#" onClick={this._openMenu}>
            <i className="fa fa-bars"></i> {selectedName}
          </a>
        </li>
        {children}
      </ul>
    );
  }
});

module.exports = MenuList;
