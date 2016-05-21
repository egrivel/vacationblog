'use strict';

var React = require('react');

var LoginAction = require('../actions/LoginAction');

var Logout = React.createClass({
  displayName: 'Login',

  propTypes: {
    onClose: React.PropTypes.func.isRequired
  },

  _onLogout: function() {
    LoginAction.doLogout();
    this.props.onClose();
  },

  render: function() {
    return (
      <div className="form login">
        <p>
          Are you sure you want to log out?
        </p>
        <div className="buttonbar">
          <input type="submit" value="Logout" onClick={this._onLogout}/>
          <input type="submit" value="Cancel" onClick={this.props.onClose} />
        </div>
      </div>
    );
  }
});

module.exports = Logout;
