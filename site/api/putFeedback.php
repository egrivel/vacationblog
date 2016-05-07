<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Feedback.php');

$auth = new AuthB();
if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $referenceId = '';
   if (isset($data['referenceId'])) {
      $referenceId = $data['referenceId'];
   }
   if (($tripId === '') || ($referenceId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else if (!$auth->canPutFeedback($tripId, $referenceId)) {
      $response = errorResponse(RESPONSE_UNAUTHORIZED);
   } else {
      $userId = $auth->getUserId();
      $object = new Feedback($tripId, $referenceId, $userId);

      if (isset($data['type'])) {
         $object->setType($data['type']);
      }
      if (isset($data['deleted'])) {
         $object->setDeleted($data['deleted']);
      }
      if ($object->save()) {
         $response = successResponse();
      } else {
         // @codeCoverageIgnoreStart
         // cannot unit test database errors
         $response = errorResponse(RESPONSE_INTERNAL_ERROR, "database save error");
         // @codeCoverageIgnoreEnd
      }
   }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'Must use PUT method');
}
echo json_encode($response);
?>
