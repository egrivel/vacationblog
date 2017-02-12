<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');
include_once(dirname(__FILE__) . '/loginFunctions.php');

$auth = new AuthB();
if (!$auth->canSendNotification()) {
  $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else {
  $data = getPostData();
  $subject = '';
  if (isset($data['subject'])) {
    $subject = $data['subject'];
  }
  $text = '';
  if (isset($data['text'])) {
     $text = $data['text'];
  }
  if (($subject === '') || ($text === '')) {
    $response = errorResponse(RESPONSE_BAD_REQUEST, 'Need subject and text');
  } else {
    if ($resultSet = User::listUsersForNotify()) {
      $count = 0;
      for ($i = 0; isset($resultSet[$i]); $i++) {
        $email = $resultSet[$i]['email'];
        $intro = "Hello " . $resultSet[$i]['name'] . ",\n \n";
        $intro .= "You are receiving this message because you indicated "
          . "you want to receive updates from our vacation blog website.\n \n";
        $sign = "\n \n";
        $sign .= "Thank you,\n";
        $sign .= SITE_ADMIN_NAME . "\n";
        $sign .= "Website Administrator\n";
        send_notification_email($email, $subject, $intro . $text . $sign);
        $count++;
      }
      $response = successResponse();
      $response['count'] = $count;
    } else {
      // @codeCoverageIgnoreStart
      // cannot unit test database errors
      $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      // @codeCoverageIgnoreEnd
    }
  }
}
echo json_encode($response);
?>
