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
      send_notification_email('egrivel@gmail.com', $subject, $text);
      $response = successResponse();
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
