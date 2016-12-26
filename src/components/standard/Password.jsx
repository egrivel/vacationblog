'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Password = React.createClass({
  displayName: 'Password',

  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  },

  _onChange: function(event) {
    if (this.props.onChange) {
      this.props.onChange(event.target.value, this.props.fieldId);
    }
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
          type="password"
          value={value}
          onChange={this._onChange}
        />
      </Formrow>
    );
  }
});

module.exports = Password;
