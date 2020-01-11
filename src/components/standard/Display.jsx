'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const Display = createReactClass({
  displayName: 'Display',

  propTypes: {
    fieldId: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string
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
