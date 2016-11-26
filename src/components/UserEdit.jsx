'use strict';

const _ = require('lodash');
const React = require('react');

const Display = require('./standard/Display.jsx');
const Textbox = require('./standard/Textbox.jsx');

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

  render: function() {
    const name = _.get(this.state, 'userData.name', '');
    const email = _.get(this.state, 'userData.email', '');
    const access = _.get(this.state, 'userData.access', '');
    const notification = _.get(this.state, 'userData.notification', '');
    const tempCode = _.get(this.state, 'userData.tempCode', '');
    const externalType= _.get(this.state, 'userData.externalType', '');
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
        />
        <Textbox
          fieldId="email"
          label="Email"
          value={email}
        />
        <Textbox
          fieldId="access"
          label="Access"
          value={access}
        />
        <Textbox
          fieldId="notification"
          label="Notification"
          value={notification}
        />
        <Textbox
          fieldId="tempCode"
          label="Temp Code"
          value={tempCode}
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
        <Textbox
          fieldId="deleted"
          label="Deleted"
          value={deleted}
        />

      </div>
    );
  }
});

module.exports = UserEdit;
