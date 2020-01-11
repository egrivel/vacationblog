'use strict';

const React = require('react');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');

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

const Preferences = createReactClass({
  displayName: 'Preferences',

  mixins: [storeMixin()],

  stores: [UserStore],

  contextTypes: {
    router: PropTypes.object
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
    let externalType = '';
    let password = '';
    let password2 = '';
    let notification = '';

    if (userId) {
      const userData = UserStore.getEditData(userId);
      if (userData) {
        if (userData.name) {
          name = userData.name;
        }
        if (userData.email) {
          email = userData.email;
        }
        if (userData.externalType) {
          externalType = userData.externalType;
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
      userId: userId,
      name: name,
      email: email,
      externalType: externalType,
      password: password,
      password2: password2,
      notification: notification
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
      UserAction.setEdit(userId, 'password', '');
      UserAction.setEdit(userId, 'password2', '');
    }

    // route back to the Home tab
    this.context.router.push('/');
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
    const externalType = this.state.externalType;
    const password = this.state.password;
    const password2 = this.state.password2;
    const notification = this.state.notification;

    const access = UserStore.getAccess();
    if ((access !== 'admin') && (access !== 'visitor')) {
      return <div>No access</div>;
    }

    let description;
    if (externalType === 'facebook') {
      if (email) {
        description = (
          <p>Change your preferences. It looks like you have logged in
            using facebook, so the only preference you can change is
            whether or not to receive notification about
            the <em>vacationblog</em> website by email.</p>
        );
      } else {
        description = (
          <div>
            <p>It looks like you have logged in using facebook but not
              allowed this site to know your email. There are no preferences
              that you can change here.</p>
            <p>The only way to change this is to go to the <a
              href="https://www.facebook.com/settings?tab=applications">
              facebook app settings</a>, remove the <em>Vacation Blog</em> app,
              and re-login using facebook.</p>
            <p>Please contact <em>vacationblog@grivel.net</em> if you have
              any questions.</p>
          </div>
        );
      }
    } else {
      description = (
        <p>Change your preferences. For security reasons, it is not currently
          possible to change the previously selected email address. If you do
          need to change your email address, please contact the website
          administrator at <em>vacationblog@grivel.net</em>.</p>
      );
    }

    let idInput;
    if (externalType !== 'facebook') {
      idInput = (
        <Display
          fieldId="id"
          label="User ID"
          value={userId}
        />
       );
    }

    let nameInput;
    if (externalType === 'facebook') {
      nameInput = (
        <Display
          fieldId="name"
          label="Name"
          value={name}
        />
      );
    } else {
      nameInput = (
        <Textbox
          fieldId="name"
          label="Name"
          value={name}
          onChange={this._setValue}
        />
      );
    }

    let emailInput;
    if (externalType !== 'facebook' || email) {
      emailInput = (
        <Display
          fieldId="email"
          label="Email"
          value={email}
        />
      );
    }

    let passwordInput;
    let password2Input;
    if (externalType !== 'facebook') {
      passwordInput = (
        <Password
          fieldId="password"
          label="Password"
          value={password}
          onChange={this._setValue}
        />
      );
      password2Input = (
        <Password
          fieldId="password2"
          label="Repeat Password"
          value={password2}
          onChange={this._setValue}
        />
      );
    }

    let notificationInput;
    if (email) {
      // No notifications if there is no email
      notificationInput = (
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
      );
    }

    const buttonList = [];
    if (externalType !== 'facebook' || email) {
      buttonList.push({
        label: 'Change',
        onClick: this._onChangeValues
      });
    }
    buttonList.push({
      label: 'Cancel',
      onClick: this._onCancel
    });

    return (
      <div>
        {errors}
        {description}
        {idInput}
        {nameInput}
        {emailInput}
        {passwordInput}
        {password2Input}
        {notificationInput}
        <ButtonBar
          buttons={buttonList}
        />
      </div>
    );
  }
});

module.exports = Preferences;
