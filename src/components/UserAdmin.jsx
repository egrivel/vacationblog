'use strict';

const React = require('react');

const storeMixin = require('./StoreMixin');
const UserStore = require('../stores/UserStore');
const UserAction = require('../actions/UserAction');

const UserAdmin = React.createClass({
  displayName: 'User Admin',

  mixins: [storeMixin()],

  stores: [UserStore],

  componentDidMount: function() {
    UserAction.loadAllUsers();
  },

  _getStateFromStores: function() {
    const userList = UserStore.getUserList();
    return {
      userList: userList
    };
  },

  render: function() {
    const list = [];
    for (let i = 0; i < this.state.userList.length; i++) {
      const item = this.state.userList[i];
      list.push(
        <li key={item.userId}>
          <a href={'#/admin/user/' + item.userId}>{item.name}</a>
          {} ({item.userId})
        </li>
      );
    }
    return (
      <div>
        <h3>User Administration</h3>
        <p>This is an adminitrative function to update individual users.</p>
        <p>Please select one of the users to administer:</p>
        <ul>
          {list}
        </ul>
        <p>Or <a href="#/admin/user/_new">create a new user</a>.</p>
      </div>
    );
  }
});

module.exports = UserAdmin;
