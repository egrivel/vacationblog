'use strict';

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const Formrow = createClass({
  displayName: 'Form row',

  propTypes: {
    label: PropTypes.string,
    labelFor: PropTypes.string,
    children: PropTypes.object
  },

  render: function() {
    return (
      <div>
        <div className="formLabel" htmlFor={this.props.labelFor}>
          {this.props.label}
        </div>
        <div className="formValue">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Formrow;
