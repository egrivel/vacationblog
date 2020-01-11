'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const Password = createReactClass({
  displayName: 'Password',

  propTypes: {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
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
