'use strict';

import React from 'react';
import createReactClass from 'create-react-class';

import storeMixin from './StoreMixin';
import UserStore from '../stores/UserStore';
import UserAction from '../actions/UserAction';
import MenuAction from '../actions/MenuAction';
import MenuStore from '../stores/MenuStore';

const UserAdmin = createReactClass({
  displayName: 'User Admin',

  mixins: [storeMixin()],

  stores: [UserStore],

  componentDidMount: function() {
    UserAction.loadAllUsers();
    MenuAction.selectItem(MenuStore.menuIds.ADMIN);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.ADMIN);
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
    if (UserStore.getAccess() !== 'admin') {
      return <div>No access</div>;
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

export default UserAdmin;
