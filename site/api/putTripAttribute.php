<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/TripAttribute.php');

$auth = new AuthB();
if (!$auth->canGetTripAttribute()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $name = '';
   if (isset($data['name'])) {
      $name = $data['name'];
   }
   if (($tripId === '') || ($name === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new TripAttribute($tripId, $name);
      if (isset($data['value'])) {
         $object->setValue($data['value']);
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
