'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const ButtonBar = React.createClass({
  displayName: 'ButtonBar',

  propTypes: {
    buttons: React.PropTypes.array.isRequired
  },

  render: function() {
    const buttonList = [];
    for (let i = 0; i < this.props.buttons.length; i++) {
      if (i) {
        buttonList.push(' ');
      }
      buttonList.push(
        <button
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
