'use strict';

const _ = require('lodash');
const React = require('react');

const Display = require('./standard/Display.jsx');
const Textbox = require('./standard/Textbox.jsx');
const Droplist = require('./standard/Droplist.jsx');
const Radiolist = require('./standard/Radiolist.jsx');

const storeMixin = require('./StoreMixin');
const UserStore = require('../stores/UserStore');
const UserAction = require('../actions/UserAction');

const UserEdit = React.createClass({
  displayName: 'User Edit',

  mixins: [storeMixin()],

  stores: [UserStore],

  propTypes: {
    params: React.PropTypes.shape({
      userId: React.PropTypes.string.isRequired
    })
  },

  componentWillMount: function() {
    const userData = UserStore.getData(this.props.params.userId);
    if (!userData) {
      UserAction.loadUser(this.props.params.userId);
    }
  },

  _getStateFromStores: function() {
    const userData = UserStore.getData(this.props.params.userId);
    return {
      userData: userData
    };
  },

  _setValue: function(value, prop) {
    const userData = _.cloneDeep(this.state.userData);
    userData[prop] = value;
    UserAction.updateUser(userData);
  },

  render: function() {
    const name = _.get(this.state, 'userData.name', '');
    const email = _.get(this.state, 'userData.email', '');
    const access = _.get(this.state, 'userData.access', '');
    const notification = _.get(this.state, 'userData.notification', '');
    const tempCode = _.get(this.state, 'userData.tempCode', '');
    const externalType = _.get(this.state, 'userData.externalType', '');
    const externalId = _.get(this.state, 'userData.externalId', '');
    const deleted = _.get(this.state, 'userData.deleted', '');
    return (
      <div>
        <p>Edit user {this.props.params.userId}</p>

        <Display
          fieldId="id"
          label="User ID"
          value={this.props.params.userId}
        />
        <Textbox
          fieldId="name"
          label="Name"
          value={name}
          onChange={this._setValue}
        />
        <Textbox
          fieldId="email"
          label="Email"
          value={email}
          onChange={this._setValue}
        />
        <Droplist
          fieldId="access"
          label="Access"
          value={access}
          list={[
            {label: 'Temp', value: 'temp'},
            {label: 'Visitor', value: 'visitor'},
            {label: 'Administrator', value: 'admin'}
          ]}
          onChange={this._setValue}
        />
        <Radiolist
          fieldId="notification"
          label="Notification"
          value={notification}
          list={[
            {label: 'Yes', value: 'Y'},
            {label: 'No', value: 'N'}
          ]}
          onChange={this._setValue}
        />
        <Textbox
          fieldId="tempCode"
          label="Temp Code"
          value={tempCode}
          onChange={this._setValue}
        />
        <Display
          fieldId="external-type"
          label="External Type"
          value={externalType}
        />
        <Display
          fieldId="external-id"
          label="External ID"
          value={externalId}
        />
        <Radiolist
          fieldId="deleted"
          label="Deleted"
          value={deleted}
          list={[
            {label: 'Yes', value: 'Y'},
            {label: 'No', value: 'N'}
          ]}
          onChange={this._setValue}
        />

      </div>
    );
  }
});

module.exports = UserEdit;
