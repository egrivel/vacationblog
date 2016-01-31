'use strict';

var React = require('react');

var Login = React.createClass({
  displayName: 'Login',

  render: function() {
    return React.DOM.div(
      {
        className: 'form'
      },
      'This is the login window.',
      React.DOM.div(
        { className: 'input-element' },
        React.DOM.label(
          null,
          'User name:'
        ),
        React.DOM.input(
          {
            name: 'username',
            id: 'username'
          }
        )
      )
    );
  }
});

module.exports = Login;
