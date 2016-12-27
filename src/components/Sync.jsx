'use strict';

const React = require('react');

const storeMixin = require('./StoreMixin');
const Textbox = require('./standard/Textbox.jsx');
const Password = require('./standard/Password.jsx');
const ButtonBar = require('./standard/ButtonBar.jsx');
const SyncStore = require('../stores/SyncStore');
const SyncAction = require('../actions/SyncAction');
const MenuAction = require('../actions/MenuAction');
const MenuStore = require('../stores/MenuStore');

const Sync = React.createClass({
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
    return (
      <div>
        <p>This function is to synchronize with an external system.</p>
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

module.exports = Sync;
