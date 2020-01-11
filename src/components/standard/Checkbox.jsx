'use strict';

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const Checkbox = createClass({
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

module.exports = Checkbox;
