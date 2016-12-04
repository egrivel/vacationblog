'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Password = React.createClass({
  displayName: 'Password',

  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.string,
    onBlur: React.PropTypes.func.isRequired
  },

  defaultProps: {
    value: ''
  },

  getInitialState: function() {
    return {value: this.props.value};
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({value: nextProps.value});
  },

  _onChange: function(event) {
    this.setState({value: event.target.value});
  },

  _onBlur: function() {
    this.props.onBlur(this.state.value, this.props.fieldId);
  },

  render: function() {
    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
        labelFor={this.props.fieldId}
      >
        <input
          id={this.props.fieldId}
          type="password"
          value={this.state.value}
          onChange={this._onChange}
          onBlur={this._onBlur}
        />
      </Formrow>
    );
  }
});

module.exports = Password;
