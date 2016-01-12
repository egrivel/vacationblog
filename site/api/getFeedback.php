<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/User.php');
include_once(dirname(__FILE__) . '/../database/Feedback.php');

$auth = new AuthB();
if (!$auth->canGetFeedback()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else {
   $tripId = '';
   if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }
   $referenceId = '';
   if (isset($_GET['referenceId'])) {
      $referenceId = $_GET['referenceId'];
   }
   $userId = '';
   if (isset($_GET['userId'])) {
      $userId = $_GET['userId'];
   }

   if (($tripId === '') || ($referenceId === '') || ($userId === '')) {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   } else {
      $object = new Feedback($tripId, $referenceId, $userId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['tripId'] = $object->getTripId();
         $response['referenceId'] = $object->getReferenceId();
         $response['userId'] = $object->getUserId();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['type'] = $object->getType();
         $response['deleted'] = $object->getDeleted();
      }
   }
}
echo json_encode($response);
?>
