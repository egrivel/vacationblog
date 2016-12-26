'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Textbox = React.createClass({
  displayName: 'Textbox',

  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  },

  _onChange: function(event) {
    this.props.onChange(event.target.value, this.props.fieldId);
  },

  render: function() {
    let value = this.props.value;
    if (!value) {
      value = '';
    }

    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
        labelFor={this.props.fieldId}
      >
        <input
          id={this.props.fieldId}
          type="text"
          value={value}
          onChange={this._onChange}
        />
      </Formrow>
    );
  }
});

module.exports = Textbox;
