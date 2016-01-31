'use strict';

var React = require('react');

var Login = React.createClass({
  displayName: 'Login',

  render: function() {
    return React.DOM.div(
      {
        className: 'form login'
      },
      React.DOM.h3(
        null,
        'Login'
      ),
      React.DOM.p(
        null,
        'Please enter your user name and password to log into the site.'
      ),
      React.DOM.div(
        { className: 'input-element' },
        React.DOM.label(
          null,
          'User name:'
        ),
        React.DOM.input(
          {
            type: 'text',
            name: 'username',
            id: 'username'
          }
        )
      ),
      React.DOM.div(
        { className: 'input-element' },
        React.DOM.label(
          null,
          'Password:'
        ),
        React.DOM.input(
          {
            type: 'password',
            name: 'username',
            id: 'username'
          }
        )
      ),

      React.DOM.div(
        { className: 'buttonbar' },
        React.DOM.input(
          {
            type: 'submit',
            value: 'Login'
          }
        ),

        React.DOM.input(
          {
            type: 'submit',
            value: 'Cancel'
          }
        )
      )
    );
  }
});

module.exports = Login;
