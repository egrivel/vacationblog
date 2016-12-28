'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Textarea = React.createClass({
  displayName: 'Textarea',

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
