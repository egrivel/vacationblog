'use strict';

import _ from 'lodash';
import React from 'react';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';

import ButtonBar from './standard/ButtonBar.jsx';
import Display from './standard/Display.jsx';
import Droplist from './standard/Droplist.jsx';
import Password from './standard/Password.jsx';
import Radiolist from './standard/Radiolist.jsx';
import Textbox from './standard/Textbox.jsx';

import storeMixin from './StoreMixin';
import UserStore from '../stores/UserStore';
import UserAction from '../actions/UserAction';

const UserEdit = createReactClass({
  displayName: 'User Edit',

  mixins: [storeMixin()],

  stores: [UserStore],

  propTypes: {
    params: PropTypes.shape({
      userId: PropTypes.string.isRequired
    })
  },

  contextTypes: {
    router: PropTypes.object.isRequired
  },

  componentDidMount: function() {
    UserAction.initEdit(this.props.params.userId);
    const userData = UserStore.getEditData(this.props.params.userId);
    if (!userData || !userData.userId) {
      UserAction.loadUser(this.props.params.userId);
    }
  // Why do we need this in componentDidMount? It seems like the getInitialState
  // call from the store mixin isn't working...
    this.setState(this._getStateFromStores());
  },

  componentWillUnmount: function() {
    UserAction.clearEdit(this.props.params.userId);
  },

  _getStateFromStores: function() {
    const userData = UserStore.getEditData(this.props.params.userId);
    return {
      userData: userData
    };
  },

  _setValue: function(value, prop) {
    UserAction.setEdit(this.props.params.userId, prop, value);
  },

  _doSave: function() {
    let errorMessage = '';
    if ((this.state.userData.name === '') ||
      (this.state.userData.email === '')) {
      errorMessage = 'You must enter a name and an email.';
    } else if (this.state.userData.password || this.state.userData.password2) {
      if (this.state.userData.password.length < 6) {
        errorMessage = 'Password must be at least 6 characters.';
      } else if (this.state.userData.password !==
          this.state.userData.password2) {
        errorMessage = 'Passwords do not match.';
      }
    }

    this.setState({errorMessage: errorMessage});

    if (errorMessage === '') {
      UserAction.saveUser(this.props.params.userId, this.state.userData);
      UserAction.setEdit(this.props.params.userId, 'password', '');
      UserAction.setEdit(this.props.params.userId, 'password2', '');
    }
  },

  _doCancel: function() {
    this.context.router.push('/admin/user');
  },

  render: function() {
    const name = _.get(this.state, 'userData.name', '');
    const email = _.get(this.state, 'userData.email', '');
    const password = _.get(this.state, 'userData.password', '');
    const password2 = _.get(this.state, 'userData.password2', '');
    const access = _.get(this.state, 'userData.access', '');
    const notification = _.get(this.state, 'userData.notification', '');
    const tempCode = _.get(this.state, 'userData.tempCode', '');
    const deleted = _.get(this.state, 'userData.deleted', '');
    const buttons = [];
    buttons.push({
      label: 'Save',
      onClick: this._doSave
    });
    buttons.push({
      label: 'Cancel',
      onClick: this._doCancel
    });

    let error = null;
    if (this.state.errorMessage) {
      error = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

    if (UserStore.getAccess() !== 'admin') {
      return <div>No access</div>;
    }
    return (
      <div>
        <p>Edit user <em>{name}</em></p>
        {error}
        <Display
          fieldId="id"
          label="User ID"
          value={this.props.params.userId}
        />
        <Textbox
          fieldId="name"
          label="Name"
          value={name}
          onChange={this._setValue}
        />
        <Textbox
          fieldId="email"
          label="Email"
          value={email}
          onChange={this._setValue}
        />
        <Password
          fieldId="password"
          label="Password"
          value={password}
          onChange={this._setValue}
        />
        <Password
          fieldId="password2"
          label="Repeat password"
          value={password2}
          onChange={this._setValue}
        />
        <Droplist
          fieldId="access"
          label="Access"
          value={access}
          list={[
            {label: 'Temp', value: 'temp'},
            {label: 'Visitor', value: 'visitor'},
            {label: 'Administrator', value: 'admin'}
          ]}
          onChange={this._setValue}
        />
        <Radiolist
          fieldId="notification"
          label="Notification"
          value={notification}
          list={[
            {label: 'Yes', value: 'Y'},
            {label: 'No', value: 'N'}
          ]}
          onChange={this._setValue}
        />
        <Textbox
          fieldId="tempCode"
          label="Temp Code"
          value={tempCode}
          onChange={this._setValue}
        />
        <Radiolist
          fieldId="deleted"
          label="Deleted"
          value={deleted}
          list={[
            {label: 'Yes', value: 'Y'},
            {label: 'No', value: 'N'}
          ]}
          onChange={this._setValue}
        />
        <ButtonBar buttons={buttons}/>
      </div>
    );
  }
});

export default UserEdit;
