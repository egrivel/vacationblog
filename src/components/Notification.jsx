'use strict';

const React = require('react');

const ButtonBar = require('./standard/ButtonBar.jsx');
const Textbox = require('./standard/Textbox.jsx');
const Textarea = require('./standard/Textarea.jsx');

const NotificationAction = require('../actions/NotificationAction');

const Notification = React.createClass({
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      subject: '',
      text: '',
      errorMessage: ''
    };
  },

  _setValue: function(value, prop) {
    const newState = {};
    newState[prop] = value;
    this.setState(newState);
  },

  _doSend: function() {
    const {subject, text} = this.state;
    if ((subject === '') || (text === '')) {
      this.setState({
        errorMessage: 'Must enter both a subject and text.'
      });
      return;
    } else {
      this.setState({errorMessage: ''});
    }
    NotificationAction.sendNotification(
      this.state.subject,
      this.state.text
    );
  },

  _doCancel: function() {
    this.context.router.push('/admin');
  },

  render: function() {
    const {subject, text, errorMessage} = this.state;
    let errors;

    if (errorMessage !== '') {
      errors = <div className="errorMessage">{this.state.errorMessage}</div>;
    }

    const buttons = [];
    buttons.push({
      label: 'Send',
      onClick: this._doSend
    });
    buttons.push({
      label: 'Cancel',
      onClick: this._doCancel
    });

    return (
      <div>
        {errors}
        <p>Send an email to all the users who have indicated they are
          willing to receive communications.</p>
        <Textbox
          fieldId="subject"
          label="Subject"
          value={subject}
          onChange={this._setValue}
        />
        <Textarea
          fieldId="text"
          label="Text"
          value={text}
          onChange={this._setValue}
        />
        <ButtonBar buttons={buttons}/>
      </div>
    );
  }
});

module.exports = Notification;
