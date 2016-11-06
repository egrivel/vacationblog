'use strict';

var React = require('react');
var Login = require('./Login.jsx');

var LoginWrapper = React.createClass({
  displayName: 'Login Wrapper',

  getInitialState: function() {
    return {displayLogin: true};
  },

  _onClose: function() {
    this.setState({displayLogin: false});
  },

  render: function() {
    if (this.state.displayLogin) {
      return (
        <Login
          onClose={this._onClose}
          errorMessage=""
        />
      );
    }
    return <div>Please select an option from the menu.</div>;
  }
});

module.exports = LoginWrapper;
