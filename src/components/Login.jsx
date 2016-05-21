'use strict';

var React = require('react');

var LoginAction = require('../actions/LoginAction');

var Login = React.createClass({
  displayName: 'Login',

  propTypes: {
    onClose: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      username: '',
      password: ''
    };
  },

  _onLogin: function(event) {
    var username = this.state.username;
    var password = this.state.password;
    LoginAction.doLogin(username, password);
    this.props.onClose();
    event.preventDefault();
    event.stopPropagation();
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
    return (
      <form className="form login" onSubmit={this._onLogin}>
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
    );
  }
});

module.exports = Login;
