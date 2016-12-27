'use strict';

const React = require('react');

const ButtonBar = require('./standard/ButtonBar.jsx');
const Display = require('./standard/Display.jsx');
const Password = require('./standard/Password.jsx');
const Radiolist = require('./standard/Radiolist.jsx');
const Textbox = require('./standard/Textbox.jsx');

const storeMixin = require('./StoreMixin');
const UserStore = require('../stores/UserStore');
const UserAction = require('../actions/UserAction');
const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const Preferences = React.createClass({
  displayName: 'Preferences',

  mixins: [storeMixin()],

  stores: [UserStore],

  contextTypes: {
    router: React.PropTypes.object
  },

  getInitialState: function() {
    return {
      error: ''
    };
  },

  componentDidMount: function() {
    const userId = UserStore.getLoggedInUser();
    UserAction.initEdit(userId);
    MenuAction.selectItem(MenuStore.menuIds.PREFERENCES);
  },

  componentWillUnmount: function() {
    const userId = UserStore.getLoggedInUser();
    UserAction.clearEdit(userId);
    MenuAction.unselectItem(MenuStore.menuIds.PREFERENCES);
  },

  _getStateFromStores: function() {
    const userId = UserStore.getLoggedInUser();
    let name = '';
    let email = '';
    let password = '';
    let password2 = '';
    let notification = '';

    if (userId) {
      const userData = UserStore.getEditData(userId);
      if (userData) {
        // console.log('Data for user ' + userId + ' is: ' +
        //     JSON.stringify(userData));
        if (userData.name) {
          name = userData.name;
        }
        if (userData.email) {
          email = userData.email;
        }
        if (userData.notification) {
          notification = userData.notification;
        }
        if (userData.password) {
          password = userData.password;
        }
        if (userData.password2) {
          password2 = userData.password2;
        }
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
    UserAction.setEdit(userId, prop, value);
  },

  _onChangeValues: function() {
    // not yet implemented
    let error = '';
    if (this.state.name === '') {
      error = 'You must enter a name and an email.';
    } else if (this.state.email === '') {
      error = 'You must enter a name and an email.';
    } else if ((this.state.password !== '') || (this.state.password2 !== '')) {
      if (this.state.password.length < 6) {
        error = 'Please enter a password of at least 6 characters.';
      } else if (this.state.password !== this.state.password2) {
        error = 'Please repeat the exact same password.';
      }
    }
    this.setState({errorMessage: error});

    if (error !== '') {
      // got an error, so we're done
      return;
    }

    const userId = UserStore.getLoggedInUser();
    const currentData = UserStore.getData(userId);
    if ((this.state.name !== currentData.name) ||
      (this.state.notification !== currentData.notification)) {
      UserAction.updatePrefs(userId, this.state.name, this.state.notification);
    }
    if (this.state.email !== currentData.email) {
      UserAction.updateEmail(userId, this.state.email);
    }
    if (this.state.password !== '') {
      UserAction.updatePassword(userId, this.state.password);
    }
  },

  _onCancel: function() {
    this.context.router.push('/');
  },

  render: function() {
    let errors = null;
    if (this.state.errorMessage !== '') {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

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
        {errors}
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
