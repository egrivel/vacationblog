'use strict';

const utils = require('./utils');

const NotificationAction = {
  sendNotification: function(subject, text) {
    const url = 'api/notification.php';
    const submitData = {
      subject: subject,
      text: text
    };
    utils.postAsync(url, submitData, function(response) {
      const responseData = JSON.parse(response, true);
      if (!responseData.resultCode || (responseData.resultCode !== '200')) {
        console.log('Got response ' + response);
      }
    });
  }
};

module.exports = NotificationAction;
