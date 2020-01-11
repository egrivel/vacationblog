'use strict';

const React = require('react');
const createClass = require('create-react-class');
const PropTypes = require('prop-types');

const Welcome = require('./Welcome.jsx');

const UserStore = require('../stores/UserStore');
const UserAction = require('../actions/UserAction');

/**
 * Login Wrapper. This is a wrapper to support external links to the login
 * function.
 */

const LoginWrapper = createClass({
  displayName: 'LoginWrapper',

  propTypes: {
    params: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  },

  componentWillMount: function() {
    let targetState = UserStore.constants.LOGIN;
    if (this.props.params.target) {
      if (this.props.params.target === 'conf') {
        targetState = UserStore.constants.CONFIRM_REG;
      } else if (this.props.params.target === 'reset') {
        targetState = UserStore.constants.CONFIRM_PWD;
      }
    }
    UserAction.setLoginState(targetState);
  },

  render: function() {
    return <Welcome/>;
  }
});

module.exports = LoginWrapper;
