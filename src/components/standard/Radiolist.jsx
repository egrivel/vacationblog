'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = require('./Formrow.jsx');

const Radiolist = createReactClass({
  displayName: 'Radiolist',

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
