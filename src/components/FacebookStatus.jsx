'use strict';

const React = require('react');
const Link = require('react-router').Link;

const FacebookAction = require('../actions/FacebookAction');
const FacebookStore = require('../stores/FacebookStore');

const FacebookStatus = React.createClass({
  _getStateFromStores: function() {
    const status = FacebookStore.getStatus();
    const name = FacebookStore.getName();

    return {
      name: name,
      status: status
    };
  },

  _onChange: function() {
    this.setState(this._getStateFromStores());
  },

  getInitialState: function() {
    return this._getStateFromStores();
  },

  componentDidMount: function() {
    FacebookStore.addChangeListener(this._onChange);
    const status = FacebookStore.getStatus();
    const name = FacebookStore.getName();

    if (!status) {
      FacebookAction.getStatus();
    } else if (status === 'connected' && !name) {
      FacebookAction.loadName();
    }
  },

  componentWillUnmount: function() {
    FacebookStore.removeChangeListener(this._onChange);
  },

  componentDidUpdate: function() {
    const status = FacebookStore.getStatus();
    const name = FacebookStore.getName();

    if (!status) {
      FacebookAction.getStatus();
    } else if (status === 'connected' && !name) {
      FacebookAction.loadName();
    }
  },

  render: function() {
    if (this.state.name) {
      return (<div>Logged in as {this.state.name}.</div>);
    } else if (this.state.status) {
      return (<div>Facebook status: {this.state.status}.</div>);
    } else {
      return (<div>No facebook status yet.</div>);
    }
  }
});

module.exports = FacebookStatus;
