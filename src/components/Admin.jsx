'use strict';

var React = require('react');

var Admin = React.createClass({
  displayName: 'Admin',

  render: function() {
    return (
      <div>
        <p>Choose from one of the following options:</p>
        <ul>
          <li>
            <a href="#/admin/trip">Trip Administration</a>
          </li>
          <li>
            <a href="#/admin/user">User Administration</a>
          </li>
          <li>
            Site Administration
          </li>
        </ul>
      </div>
    );
  }
});

module.exports = Admin;
