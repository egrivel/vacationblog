<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/TripAttribute.php');

$auth = new AuthB();
if (!$auth->canGetTripAttribute()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else {
   $tripId = '';
   if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }
   $name = '';
   if (isset($_GET['name'])) {
      $name = $_GET['name'];
   }

   if (($tripId === '') || ($name === '')) {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   } else {
      $object = new TripAttribute($tripId, $name);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['tripId'] = $object->getTripId();
         $response['name'] = $object->getName();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['value'] = $object->getValue();
         $response['deleted'] = $object->getDeleted();
      }
   }
}
echo json_encode($response);
?>
