'use strict';

const React = require('react');

const Formrow = require('./Formrow.jsx');

const Checkbox = React.createClass({
  displayName: 'Checkbox',

  propTypes: {
    fieldId: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool,
    onBlur: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {selected: true || this.props.selected || false};
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({selected: nextProps.selected || false});
  },

  _onChange: function(event) {
    const selected = event.target.checked || false;
    this.props.onBlur(selected, this.props.fieldId);
    this.setState({selected: selected});
  },

  _toggleValue: function() {
    const selected = !this.state.selected;
    this.props.onBlur(selected, this.props.fieldId);
    this.setState({selected: selected});
  },

  _onBlur: function() {
    this.props.onBlur(this.state.selected, this.props.fieldId);
  },

  render: function() {
    const selected = this.state.selected;
    return (
      <Formrow
        key={'k-' + this.props.fieldId + selected}
      >
        <span>
          <input
            type="checkbox"
            id={this.props.fieldId}
            value="Y"
            checked={selected}
            onChange={this._onChange}
          />
          <label
            className="checkbox"
            htmlFor={this.props.fieldId}
            onClick={this._toggleValue}
          >
            {this.props.label}
          </label>
        </span>
      </Formrow>
    );
  }
});

module.exports = Checkbox;
