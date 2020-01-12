'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import Formrow from './Formrow';

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

export default Password;
