'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Display = React.createClass({
  displayName: 'Display',

  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string
  },

  defaultProps: {
    value: ''
  },

  render: function() {
    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
      >
        <span>
          {this.props.value}
        </span>
      </Formrow>
    );
  }
});

module.exports = Display;
