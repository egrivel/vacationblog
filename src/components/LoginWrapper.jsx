'use strict';

import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import Welcome from './Welcome.jsx';

import UserStore from '../stores/UserStore';
import UserAction from '../actions/UserAction';

/**
 * Login Wrapper. This is a wrapper to support external links to the login
 * function.
 */

const LoginWrapper = createReactClass({
  displayName: 'LoginWrapper',

  propTypes: {
    params: PropTypes.object,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    })
  },

  componentDidMount: function() {
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

export default LoginWrapper;
