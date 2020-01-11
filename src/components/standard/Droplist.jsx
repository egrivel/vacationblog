'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const Droplist = createReactClass({
  displayName: 'Droplist',

  propTypes: {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func.isRequired
  },

  _onChange: function(event) {
    this.props.onChange(event.target.value, this.props.fieldId);
  },

  render: function() {
    const options = [];
    let value = this.props.value;
    if (!value) {
      value = '';
    }
    for (let i = 0; i < this.props.list.length; i++) {
      const item = this.props.list[i];
      options.push(
        <option
          key={'o-' + i}
          value={item.value}
        >
          {item.label}
        </option>
      );
    }
    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
        labelFor={this.props.fieldId}
      >
        <select
          id={this.props.fieldId}
          onChange={this._onChange}
          value={value}
        >
          {options}
        </select>
      </Formrow>
    );
  }
});

module.exports = Droplist;
