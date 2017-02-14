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
    const subject = this.state.subject;
    const text = this.state.text;

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
    this.context.router.push('/admin');
  },

  _doCancel: function() {
    this.context.router.push('/admin');
  },

  render: function() {
    const subject = this.state.subject;
    const text = this.state.text;
    const errorMessage = this.state.errorMessage;

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
        <p>The email will be prefixed by a customized salutation and a
          signature will be appended, so please enter only the body of the
          email text.</p>
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
