<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/TripUser.php');

$auth = new AuthB();
if (!$auth->canGetMedia()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else {
   $tripId = '';
   if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }
   $userId = '';
   if (isset($_GET['userId'])) {
      $userId = $_GET['userId'];
   }

   if (($tripId === '') || ($userId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new TripUser($tripId, $userId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['tripId'] = $object->getTripId();
         $response['userId'] = $object->getUserId();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['role'] = $object->getRole();
         $response['message'] = $object->getMessage();
         $response['deleted'] = $object->getDeleted();
      }
   }
}
echo json_encode($response);
?>
