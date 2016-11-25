'use strict';

const React = require('react');

const Formrow = React.createClass({
  displayName: 'Form row',

  propTypes: {
    label: React.PropTypes.string,
    labelFor: React.PropTypes.string,
    children: React.PropTypes.object
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
