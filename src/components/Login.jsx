'use strict';

var React = require('react');

var storeMixin = require('./StoreMixin');

var LoginAction = require('../actions/LoginAction');
var UserStore = require('../stores/UserStore');

var Login = React.createClass({
  displayName: 'Login',

  stores: [UserStore],

  mixins: [storeMixin()],

  propTypes: {
    onClose: React.PropTypes.func.isRequired
  },

  // getInitialState: function() {
  //   var name = UserStore.getLoggedInUser();
  //   var errorMessage = UserStore.getFormErrorMessage();
  //   return {
  //     username: name,
  //     password: '',
  //     errorMessage: errorMessage
  //   };
  // },

  _getStateFromStores: function() {
    var name = UserStore.getLoggedInUser();
    var errorMessage = UserStore.getFormErrorMessage();
    return {
      username: name,
      password: '',
      errorMessage: errorMessage
    };
  },

  _noProp: function(event) {
    event.preventDefault();
    event.stopPropagation();
  },

  _onLogin: function(event) {
    var username = this.state.username;
    var password = this.state.password;
    LoginAction.doLogin(username, password);
    this._noProp(event);
  },

  componentDidMount: function() {
    this.refs.username.focus();
  },

  _updateField: function(event) {
    var fieldToUpdate = event.target.id;
    var newValue = event.target.value;
    var newState = {};
    newState[fieldToUpdate] = newValue;
    this.setState(newState);
  },

  render: function() {
    var errors = null;
    if (this.state.errorMessage) {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }
    return (
      <div className="modal" onClick={this.props.onClose}>
        <form className="form login" onClick={this._noProp}
            onSubmit={this._onLogin}>
          {errors}
          <p>
            Please enter your user name and password to log into the site.
          </p>
          <div className="input-element">
            <label>User name:</label>
            <input type="text" ref="username" name="username" id="username"
              value={this.state.username} onChange={this._updateField}/>
          </div>
          <div className="input-element">
            <label>Password:</label>
            <input type="password" name="password" id="password"
              value={this.state.password} onChange={this._updateField}/>
          </div>
          <div className="buttonbar">
            <input type="submit" value="Login" onClick={this._onLogin}/>
            <input type="submit" value="Cancel" onClick={this.props.onClose} />
          </div>
        </form>
      </div>
    );
  }
});

module.exports = Login;
