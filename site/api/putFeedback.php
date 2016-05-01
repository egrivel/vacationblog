<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Feedback.php');

$auth = new AuthB();
if (!$auth->canGetFeedback()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $referenceId = '';
   if (isset($data['referenceId'])) {
      $referenceId = $data['referenceId'];
   }
   $userId = '';
   if (isset($data['userId'])) {
      $userId = $data['userId'];
   }
   if (($tripId === '') || ($referenceId === '') || ($userId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
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
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
   }
 }
echo json_encode($response);
?>
