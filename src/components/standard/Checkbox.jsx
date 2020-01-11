'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import Formrow from './Formrow.jsx';

const Checkbox = createReactClass({
  displayName: 'Checkbox',

  propTypes: {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onChange: PropTypes.func.isRequired
  },

  _onChange: function(event) {
    this.props.onChange(event.target.checked, this.props.fieldId);
  },

  _toggleValue: function() {
    this.props.onChange(!this.props.selected, this.props.fieldId);
  },

  render: function() {
    const selected = this.props.selected;
    return (
      <Formrow
        key={'k-' + this.props.fieldId + selected}
      >
        <label
          className="checkbox"
          htmlFor={this.props.fieldId}
          onClick={this._toggleValue}
        >
          <input
            type="checkbox"
            id={this.props.fieldId}
            value="Y"
            checked={selected}
            onChange={this._onChange}
          />
          {this.props.label}
        </label>
      </Formrow>
    );
  }
});

export default Checkbox;
