'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Droplist = React.createClass({
  displayName: 'Droplist',

  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    list: React.PropTypes.arrayOf(React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired
    })).isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  _onChange: function(event) {
    this.props.onChange(event.target.value, this.props.fieldId);
  },

  render: function() {
    const options = [];
    for (let i = 0; i < this.props.list.length; i++) {
      const item = this.props.list[i];
      let selected = false;
      if (item.value === this.props.value) {
        selected = true;
      }
      options.push(
        <option
          key={'o-' + i}
          value={item.value}
          selected={selected}
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
        >
          {options}
        </select>
      </Formrow>
    );
  }
});

module.exports = Droplist;
