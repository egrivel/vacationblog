'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Radiolist = React.createClass({
  displayName: 'Radiolist',

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
    this.props.onChange(event.target.value, this.props.fieldId);
  },

  render: function() {
    const options = [];
    for (let i = 0; i < this.props.list.length; i++) {
      const item = this.props.list[i];
      let checked = false;
      if (item.value === this.props.value) {
        checked = true;
      }
      options.push(
        <label
          className="radiobutton"
          htmlFor={this.props.fieldId + '-' + i}
          key={'r-' + i}
        >
          <input
            id={this.props.fieldId + '-' + i}
            name={this.props.fieldId}
            type="radio"
            value={item.value}
            checked={checked}
            onChange={this._onChange}
          />
          {item.label + ' '}
        </label>
      );
    }
    return (
      <Formrow
        key={'k-' + this.props.fieldId}
        label={this.props.label}
        labelFor={this.props.fieldId}
      >
        <span className="radioList">
          {options}
        </span>
      </Formrow>
    );
  }
});

module.exports = Radiolist;
