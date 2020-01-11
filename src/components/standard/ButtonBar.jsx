'use strict';

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const ButtonBar = createClass({
  displayName: 'ButtonBar',

  propTypes: {
    buttons: PropTypes.array.isRequired
  },

  render: function() {
    const buttonList = [];
    for (let i = 0; i < this.props.buttons.length; i++) {
      if (i) {
        buttonList.push(' ');
      }
      buttonList.push(
        <button
          type="submit"
          key={'b-' + i}
          onClick={this.props.buttons[i].onClick}
        >
          {this.props.buttons[i].label}
        </button>
      );
    }
    return (
      <Formrow
        label=""
      >
        <div>
          {buttonList}
        </div>
      </Formrow>
    );
  }
});

module.exports = ButtonBar;
