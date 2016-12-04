'use strict';

/**
 * Login Functionality.
 *
 * This component renders the login "modal". There is a number of different
 * states that this modal can be in, defined by the "login state".
 *
 * Regular login:
 *  - select the login/register link
 *  - enter user ID and password
 *  - is logged in successfully
 *
 * A new user registering in a single step:
 *  - select the login/register link
 *  - select the "register" option
 *  - answer the questions
 *  - receive the confirmation window
 *  - user ID is prefilled
 *  - enter the confirmation code in the window
 *  - be logged in
 *
 * A new user registering in two steps:
 *  - select the login/register link
 *  - select the "register" option
 *  - answer the questions
 *  - receive the confirmation window
 *  - close the confirmation window - the user is *not* logged in
 *  - returns at a later time
 *  - select the login/register link
 *  - select the "confirmation code" option
 *  - enter the user ID and confirmation code
 *  - redirected to the login window to actually log in
 *
 * A user who lost their user ID:
 *  - select the login/register link
 *  - select the "retrieve" option
 *  - enter an email
 *  - window closes
 *  - when user receives email, they will have their user ID and can
 *    now log in the normal way
 *
 * A user who lost their password, in a single step:
 *  - select the login/register link
 *  - select the "retrieve" option
 *  - enter their user ID
 *  - receive the confirmation window
 *  - user ID is prefilled
 *  - enter the confirmation code in the window
 *  - upon confirmation, enters password twice
 *  - when password is successfully updated, redirected to login window
 *    to actually log in
 *
 * A user who lost their password, in two steps:
 *  - select the login/register link
 *  - select the "retrieve" option
 *  - enter their user ID
 *  - receive the confirmation window
 *  - closes the confirmation window - the user is *not* logged in
 *  - returns at a later time
 *  - select the login/register link
 *  - select the "confirmation code" option
 *  - enter the user ID and confirmation code
 *  - upon confirmation, enters password twice
 *  - when password is successfully updated, redirected to login window
 *    to actually log in
 */

const React = require('react');

const storeMixin = require('./StoreMixin');

const Textbox = require('./standard/Textbox.jsx');
const Password = require('./standard/Password.jsx');
const Checkbox = require('./standard/Checkbox.jsx');
const ButtonBar = require('./standard/ButtonBar.jsx');

const LoginAction = require('../actions/LoginAction');
const UserAction = require('../actions/UserAction');
const UserStore = require('../stores/UserStore');

const Login = React.createClass({
  displayName: 'Login',

  stores: [UserStore],

  mixins: [storeMixin()],

  propTypes: {
    onClose: React.PropTypes.func.isRequired
  },

  _getStateFromStores: function() {
    const errorMessage = UserStore.getFormErrorMessage();
    const loginState = UserStore.getLoginState();
    return {
      errorMessage: errorMessage,
      loginState: loginState
    };
  },

  componentDidMount: function() {
    const element = document.getElementById('userId'); // eslint-disable-line no-undef
    if (element) {
      element.focus();
    }
  },

  // ========================================================================
  // Navigate between different screens
  // ========================================================================

  _goLogin: function() {
    UserAction.setLoginState(UserStore.constants.LOGIN);
    UserAction.setLoginFormError('');
    this.setState({
      password: '',
      password2: ''
    });
  },

  _goRetrieve: function() {
    UserAction.setLoginState(UserStore.constants.RETRIEVE);
    UserAction.setLoginFormError('');
    this.setState({
      password: '',
      password2: ''
    });
  },

  _goRegister: function() {
    UserAction.setLoginState(UserStore.constants.REGISTER);
    UserAction.setLoginFormError('');
    this.setState({
      password: '',
      password2: ''
    });
  },

  _goConfirmReg: function() {
    UserAction.setLoginState(UserStore.constants.CONFIRM_REG);
    UserAction.setLoginFormError('');
    this.setState({
      password: '',
      password2: '',
      confCode: ''
    });
  },

  _goConfirmPwd: function() {
    UserAction.setLoginState(UserStore.constants.CONFIRM_PWD);
    UserAction.setLoginFormError('');
    this.setState({
      password: '',
      password2: '',
      confCode: ''
    });
  },

  // ========================================================================
  // Handle buttons
  // ========================================================================

  _noProp: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  _onLogin: function(event) {
    const userId = this.state.userId;
    const password = this.state.password;
    if (!userId || !password) {
      UserAction.setLoginFormError(
        'You need to enter all the information on this screen.');
    } else {
      UserAction.setLoginFormError('');
      LoginAction.doLogin(userId, password);
    }
    this._noProp(event);
  },

  _onRegister: function(event) {
    const userId = this.state.userId;
    const name = this.state.name;
    const email = this.state.email;
    const password = this.state.password;
    const password2 = this.state.password2;
    const notification = this.state.notification;

    if (!userId || !name || !email || !password || !password2) {
      UserAction.setLoginFormError(
        'You need to enter all the information on this screen.');
    } else if (password.length < 6) {
      UserAction.setLoginFormError(
        'Please enter a password of at least 6 characters.');
    } else if (password !== password2) { // eslint-disable-line no-negated-condition
      UserAction.setLoginFormError(
        'Please repeat the exact same password.');
    } else {
      UserAction.setLoginFormError('');
      LoginAction.doRegister(userId, name, email, password, notification);
    }
    this._noProp(event);
  },

  _onRetrieve: function(event) {
    const userId = this.state.userId;
    const email = this.state.email;
    if (!userId && !email) {
      UserAction.setLoginFormError('Enter either a user ID or an email');
    } else if (userId && email) {
      UserAction.setLoginFormError('Enter either a user ID or an email');
    } else {
      UserAction.setLoginFormError('');
      LoginAction.doRetrieve(userId, email);
    }
    this._noProp(event);
  },

  _onConfirmReg: function(event) {
    const userId = this.state.userId;
    const confCode = this.state.confCode;
    const password = this.state.password;
    if (!userId || !confCode) {
      UserAction.setLoginFormError(
        'Please enter User ID and Confirmation Code');
    } else {
      UserAction.setLoginFormError('');
      LoginAction.doConfirmReg(userId, confCode, password);
    }
    this._noProp(event);
  },

  _onConfirmPwd: function(event) {
    const userId = this.state.userId;
    const confCode = this.state.confCode;
    const password = this.state.password;
    const password2 = this.state.password2;

    if (!userId || !confCode || !password || !password2) {
      UserAction.setLoginFormError(
        'You need to enter all the information on this screen.');
    } else if (password.length < 6) {
      UserAction.setLoginFormError(
        'Please enter a password of at least 6 characters.');
    } else if (password !== password2) { // eslint-disable-line no-negated-condition
      UserAction.setLoginFormError(
        'Please repeat the exact same password.');
    } else {
      UserAction.setLoginFormError('');
      LoginAction.doConfirmPwd(userId, confCode, password);
    }
    this._noProp(event);
  },

  _onLogout: function() {
    LoginAction.doLogout();
    this.props.onClose();
  },

  // ========================================================================
  // Handle inputs
  // ========================================================================

  _setValue: function(value, fieldId) {
    const newState = {};
    newState[fieldId] = value;
    this.setState(newState);
  },

  // ========================================================================
  // Render screens
  // ========================================================================

  _renderOtherThings: function(status) {
    let list = [];
    if (status !== UserStore.constants.LOGIN) {
      list.push(<li key="login">If you already have a user ID and password,
        you can <a href="#/login" onClick={this._goLogin}>login</a>.</li>);
    }
    if (status !== UserStore.constants.REGISTER) {
      list.push(<li key="register">If you are not yet registered on this site,
        you can <a href="#/register" onClick={this._goRegister}>register
        now.</a></li>);
    }
    if (status !== UserStore.constants.CONFIRM_REG) {
      list.push(<li key="confirm-reg">If you received an email with a
        registration confirmation code, you
        can <a href="#/confirm" onClick={this._goConfirmReg}>enter that
        registration confirmation code</a> and complete registration.</li>);
    }
    if (status !== UserStore.constants.RETRIEVE) {
      list.push(<li key="retrieve">If you do not remember your user ID or
        password, you
        can <a href="#/retrieve" onClick={this._goRetrieve}>retrieve your
        login information.</a></li>);
    }
    if (status !== UserStore.constants.CONFIRM_PWD) {
      list.push(<li key="confirm-pwd">If you received an email with a
        password reset confirmation code, you
        can <a href="#/confirm" onClick={this._goConfirmPwd}>enter that
        password reset confirmation code</a> and reset your password.</li>);
    }
    list.push(<li key="help">If none of the above are helpful, please send
      an email to <em>vacationblog@grivel.net</em> asking for
      help.</li>);
    return (
      <div>
        <h4>Other things you can do from here:</h4>
        <ul>
          {list}
        </ul>
      </div>
    );
  },

  _renderLogin: function() {
    let errors = null;
    if (this.state.errorMessage) {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

    const buttonList = [];
    buttonList.push({
      label: 'Login',
      onClick: this._onLogin
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this.props.onClose
    });

    return (
      <form className="form login" onClick={this._noProp}
         >
        <h3>Login</h3>
        {errors}
        <p>
          Please enter your user ID and password to log into the site.
        </p>
        <Textbox
          fieldId="userId"
          label="User ID"
          value={this.state.userId}
          onBlur={this._setValue}
        />
        <Password
          fieldId="password"
          label="Password"
          value={this.state.password}
          onBlur={this._setValue}
        />
        <ButtonBar
          buttons={buttonList}
        />
        {this._renderOtherThings(UserStore.constants.LOGIN)}
      </form>
    );
  },

  _renderRegister: function() {
    let errors = null;
    if (this.state.errorMessage) {
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
      label: 'Register',
      onClick: this._onRegister
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this.props.onClose
    });

    return (
      <form className="form login" onClick={this._noProp}
          onSubmit={this._onRegister}>
        <h3>Register for this website</h3>
        {errors}
        <p>Please fill out the information below to register for this
          website.</p>
        <Textbox
          fieldId="userId"
          label="User ID"
          value={userId}
          onBlur={this._setValue}
        />
        <Textbox
          fieldId="name"
          label="Full Name"
          value={name}
          onBlur={this._setValue}
        />
        <Textbox
          fieldId="email"
          label="Email Address"
          value={email}
          onBlur={this._setValue}
        />
        <Password
          fieldId="password"
          label="Password"
          value={password}
          onBlur={this._setValue}
        />
        <Password
          fieldId="password2"
          label="Repeat Password"
          value={password2}
          onBlur={this._setValue}
        />
        <Checkbox
          fieldId="notification"
          label={'Please send me an email notification when this website ' +
            'is updated'}
          selected={notification}
          onBlur={this._setValue}
        />
        <ButtonBar
          buttons={buttonList}
        />
        <p>When you register, an email will be sent to your email address with
          the confirmation code. You will need to enter that confirmation code
          in order to complete the registration process.</p>
        {this._renderOtherThings(UserStore.constants.REGISTER)}
      </form>
    );
  },

  _renderRetrieve: function() {
    let errors = null;
    if (this.state.errorMessage) {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

    const userId = this.state.userId;
    const email = this.state.email;

    const buttonList = [];
    buttonList.push({
      label: 'Retrieve',
      onClick: this._onRetrieve
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this.props.onClose
    });

    return (
      <form className="form login" onClick={this._noProp}
          onSubmit={this._onRetrieve}>
        <h3>Retrieve</h3>
        {errors}
        <p>If you have registered before but do not remember your login
          information, you can use this function to retrieve that
          information.</p>
        <ul>
          <li>If you do not know your user ID, please enter the email address
            you used to register with this site. An email will be sent to that
            address reminding you of your user ID.
            <Textbox
              fieldId="email"
              label="Email Address"
              value={email}
              onBlur={this._setValue}
            />
        <ButtonBar
          buttons={buttonList}
        />
          </li>
        </ul>
        <ul>
          <li>If you know your user ID but do not know your password, please
            enter the user ID that you registered with on this site. An email
            will be sent to the associated email address with a confirmation
            code, which you can use to reset your password.
            <Textbox
              fieldId="userId"
              label="User ID"
              value={userId}
              onBlur={this._setValue}
            />
        <ButtonBar
          buttons={buttonList}
        />
          </li>
        </ul>
        <ul>
          <li>If you remember neither your user ID nor your password, please
            follow the first step above to retrieve your user ID and then, with
            that user ID, follow the second step above to reset your
            password.</li>
        </ul>
        {this._renderOtherThings(UserStore.constants.RETRIEVE)}
      </form>
    );
  },

  _renderConfirmReg: function() {
    let errors = null;
    if (this.state.errorMessage) {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

    const buttonList = [];
    buttonList.push({
      label: 'Confirm',
      onClick: this._onConfirmReg
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this.props.onClose
    });

    return (
      <form className="form login" onClick={this._noProp}
          onSubmit={this._onConfirmReg}>
        <h3>Confirmation Code</h3>
        {errors}
        <p>An email has been sent to you with a confirmation code. Please enter
          your user ID and the confirmation code you received below to
          continue. <em>User ID and confirmation code are case sensitive!</em>
        </p>
        <Textbox
          fieldId="userId"
          label="User ID"
          value={this.state.userId}
          onBlur={this._setValue}
        />
        <Textbox
          fieldId="confCode"
          label="Confirmation Code"
          value={this.state.confCode}
          onBlur={this._setValue}
        />
        <ButtonBar
          buttons={buttonList}
        />
        {this._renderOtherThings(UserStore.constants.CONFIRM_REG)}
      </form>
    );
  },

  _renderConfirmPwd: function() {
    let errors = null;
    if (this.state.errorMessage) {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

    const buttonList = [];
    buttonList.push({
      label: 'Confirm',
      onClick: this._onConfirmPwd
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this.props.onClose
    });

    return (
      <form className="form login" onClick={this._noProp}
          onSubmit={this._onConfirmPwd}>
        <h3>Password Reset</h3>
        {errors}
        <p>An email has been sent to you with a confirmation code. Please enter
          your user ID and confirmation code you received below, and enter your
          desired password. <em>User ID and confirmation code are case
          sensitive!</em>
        </p>
        <Textbox
          fieldId="userId"
          label="User ID"
          value={this.state.userId}
          onBlur={this._setValue}
        />
        <Textbox
          fieldId="confCode"
          label="Confirmation Code"
          value={this.state.confCode}
          onBlur={this._setValue}
        />
        <Password
          fieldId="password"
          label="Password"
          value={this.state.password}
          onBlur={this._setValue}
        />
        <Password
          fieldId="password2"
          label="Repeat Password"
          value={this.state.password2}
          onBlur={this._setValue}
        />
        <ButtonBar
          buttons={buttonList}
        />
        {this._renderOtherThings(UserStore.constants.CONFIRM_REG)}
      </form>
    );
  },

  _renderLogout: function() {
    const buttonList = [];
    buttonList.push({
      label: 'Logout',
      onClick: this._onLogout
    });
    buttonList.push({
      label: 'Cancel',
      onClick: this.props.onClose
    });

    return (
      <form className="form login" onClick={this._noProp}
          onSubmit={this._onLogout}>
        <h3>Logout</h3>
        <p>Are you sure you want to log out?</p>
        <ButtonBar
          buttons={buttonList}
        />
      </form>
    );
  },

  // ========================================================================
  // Overall render function
  // ========================================================================

  render: function() {
    let body;
    if (this.state.loginState === UserStore.constants.REGISTER) {
      body = this._renderRegister();
    } else if (this.state.loginState === UserStore.constants.RETRIEVE) {
      body = this._renderRetrieve();
    } else if (this.state.loginState === UserStore.constants.CONFIRM_REG) {
      body = this._renderConfirmReg();
    } else if (this.state.loginState === UserStore.constants.CONFIRM_PWD) {
      body = this._renderConfirmPwd();
    } else if (this.state.loginState === UserStore.constants.LOGOUT) {
      body = this._renderLogout();
    } else {
      body = this._renderLogin();
    }
    return (
      <div className="modal" onClick={this.props.onClose}>
        <div className="modal-login">
          {body}
        </div>
      </div>
    );
  }
});

module.exports = Login;
