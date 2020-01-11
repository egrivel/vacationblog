'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const Textarea = createReactClass({
  displayName: 'Textarea',

  propTypes: {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired
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
        <textarea rows={10} cols={60}
          id={this.props.fieldId}
          value={value}
          onChange={this._onChange}>
        </textarea>
      </Formrow>
    );
  }
});

module.exports = Textarea;
