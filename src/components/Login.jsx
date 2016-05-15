'use strict';

var React = require('react');

var LoginAction = require('../actions/LoginAction');

var Login = React.createClass({
  displayName: 'Login',

  getInitialState: function() {
    return {
      username: '',
      password: ''
    };
  },

  _onLogin: function() {
    var username = this.state.username;
    var password = this.state.password;
    LoginAction.doLogin(username, password);
  },

  _updateField: function(event) {
    var fieldToUpdate = event.target.id;
    var newValue = event.target.value;
    var newState = {};
    newState[fieldToUpdate] = newValue;
    this.setState(newState);
  },

  render: function() {
    return (
      <div className="form login">
        <p>
          Please enter your user name and password to log into the site.
        </p>
        <div className="input-element">
          <label>User name:</label>
          <input type="text" name="username" id="username"
            value={this.state.username} onChange={this._updateField}/>
        </div>
        <div className="input-element">
          <label>Password:</label>
          <input type="password" name="password" id="password"
            value={this.state.password} onChange={this._updateField}/>
        </div>
        <div className="buttonbar">
          <input type="submit" value="Login" onClick={this._onLogin}/>
          <input type="submit" value="Cancel"/>
        </div>
      </div>
    );
  }
});

module.exports = Login;
