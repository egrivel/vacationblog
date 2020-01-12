'use strict';

import React from 'react';
import createReactClass from 'create-react-class';

import storeMixin from './StoreMixin';
import Textbox from './standard/Textbox';
import Password from './standard/Password';
import ButtonBar from './standard/ButtonBar';
import SyncStore from '../stores/SyncStore';
import SyncAction from '../actions/SyncAction';
import MenuAction from '../actions/MenuAction';
import MenuStore from '../stores/MenuStore';
import UserStore from '../stores/UserStore';

const Sync = createReactClass({
  displayName: 'Sync',

  mixins: [storeMixin()],

  stores: [SyncStore],

  componentDidMount: function() {
    MenuAction.selectItem(MenuStore.menuIds.ADMIN);
  },

  componentWillUnmount: function() {
    MenuAction.unselectItem(MenuStore.menuIds.ADMIN);
  },

  _getStateFromStores: function() {
    const syncInfo = SyncStore.getInfo();
    return {
      site: syncInfo.site,
      password: syncInfo.password,
      message: syncInfo.message
    };
  },

  _updateSite: function(value) {
    const syncInfo = {};
    syncInfo.site = value;
    syncInfo.password = this.state.password;
    syncInfo.message = this.state.message;
    SyncAction.updateInfo(syncInfo);
  },

  _updatePassword: function(value) {
    const syncInfo = {};
    syncInfo.site = this.state.site;
    syncInfo.password = value;
    syncInfo.message = this.state.message;
    SyncAction.updateInfo(syncInfo);
  },

  _doSync: function() {
    SyncAction.doSync(this.state.site, this.state.password);
  },

  _renderSiteInput: function() {
    const site = this.state.site;

    return (
      <Textbox
        fieldId="name"
        label="Site Address"
        value={site}
        onChange={this._updateSite}
      />
    );
  },

  _renderPasswordInput: function() {
    const password = this.state.password;

    return (
      <Password
        fieldId="password"
        label="Password"
        value={password}
        onChange={this._updatePassword}
      />
    );
  },

  render: function() {
    const buttonList = [];
    buttonList.push({
      label: 'Sync',
      onClick: this._doSync
    });
    if (UserStore.getAccess() !== 'admin') {
      return <div>No access</div>;
    }
    return (
      <div>
        <p>This function is to synchronize with an external system.</p>
        <p>Standard: http://vacationblog.grivel.net/</p>
        {this._renderSiteInput()}
        {this._renderPasswordInput()}
        <ButtonBar
          buttons={buttonList}
        />
        <p>Result: {this.state.message}</p>
      </div>
    );
  }
});

export default Sync;
