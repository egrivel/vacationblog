'use strict';

import React from 'react';
import createReactClass from 'create-react-class';

import MenuAction from '../actions/MenuAction';
import MenuStore from '../stores/MenuStore';
import UserStore from '../stores/UserStore';

const Admin = createReactClass({
  displayName: 'Admin',

  componentDidMount: function() {
    MenuAction.selectItem(MenuStore.menuIds.ADMIN);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.ADMIN);
  },

  render: function() {
    if (UserStore.getAccess() !== 'admin') {
      return <div>No access</div>;
    }
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
            <a href="#/admin/sync">Synchronize with another site</a>
          </li>
          <li>
            <a href="#/admin/notification">Send note to all users</a>
          </li>
          <li>
            Site Administration
          </li>
        </ul>
      </div>
    );
  }
});

export default Admin;
