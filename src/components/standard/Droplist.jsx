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
    const options = [];
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
          value={this.state.value}
          onChange={this._onChange}
          onBlur={this._onBlur}
        >
          {options}
        </select>
      </Formrow>
    );
  }
});

module.exports = Droplist;
