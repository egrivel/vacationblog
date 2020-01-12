
import utils from './utils';

const NotificationAction = {
  sendNotification: function(subject, text) {
    const url = 'api/notification.php';
    const submitData = {
      subject: subject,
      text: text
    };
    utils.postAsync(url, submitData, (response) => {
      const responseData = JSON.parse(response, true);
      if (!responseData.resultCode || (responseData.resultCode !== '200')) {
        // eslint-disable-next-line no-console
        console.log('Got response ' + response);
      }
    });
  }
};

export default NotificationAction;
