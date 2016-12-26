'use strict';

const _ = require('lodash');
const React = require('react');

const ButtonBar = require('./standard/ButtonBar.jsx');
const Display = require('./standard/Display.jsx');
const Password = require('./standard/Password.jsx');
const Radiolist = require('./standard/Radiolist.jsx');
const Textbox = require('./standard/Textbox.jsx');

const storeMixin = require('./StoreMixin');
const UserStore = require('../stores/UserStore');
const UserAction = require('../actions/UserAction');

const Preferences = React.createClass({
  displayName: 'Preferences',

  mixins: [storeMixin()],

  stores: [UserStore],

  _getStateFromStores: function() {
    const userId = UserStore.getLoggedInUser();
    let name = '';
    let email = '';
    let password = '';
    let password2 = '';
    let notification = '';

    if (userId) {
      const userData = UserStore.getData(userId);
      if (userData) {
        // console.log('Data for user ' + userId + ' is: ' +
        //     JSON.stringify(userData));
        if (userData.editName) {
          name = userData.editName;
        } else {
          name = userData.name;
        }
        if (userData.editEmail) {
          email = userData.editEmail;
        } else {
          email = userData.email;
        }
        if (userData.editNotification) {
          notification = userData.editNotification;
        } else {
          notification = userData.notification;
        }
        password = userData.editPassword;
        password2 = userData.editPassword2;
      }
    }
    return {
      userId,
      name,
      email,
      password,
      password2,
      notification
    };
  },

  _setValue: function(value, prop) {
    const userId = UserStore.getLoggedInUser();
    const userData = _.cloneDeep(UserStore.getData(userId));
    if (prop === 'name') {
      userData.editName = value;
    } else if (prop === 'email') {
      userData.editEmail = value;
    } else if (prop === 'password') {
      userData.editPassword = value;
    } else if (prop === 'password2') {
      userData.editPassword2 = value;
    } else if (prop === 'notification') {
      userData.editNotification = value;
    }
    UserAction.updateUser(userData);
  },

  _onChangeValues: function() {
    // not yet implemented
  },

  _onCancel: function() {
    // not yet implemented
  },

  render: function() {
    const userId = this.state.userId;
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    const password2 = this.state.password2;
    const notification = this.state.notification;

    const buttonList = [];
    buttonList.push({
      label: 'Change',
      onClick: this._onChangeValues
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this._onCancel
    });

    return (
      <div>
        <p>Change your preferences. If you change your email, you will have
          to verify the new email address.</p>
        <Display
          fieldId="id"
          label="User ID"
          value={userId}
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
          label="Repeat Password"
          value={password2}
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
        <ButtonBar
          buttons={buttonList}
        />
      </div>
    );
  }
});

module.exports = Preferences;
