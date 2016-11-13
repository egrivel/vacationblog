<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/TripUser.php');

$auth = new AuthB();
if (!$auth->canGetMedia()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $userId = '';
   if (isset($data['userId'])) {
      $userId = $data['userId'];
   }
   if (($tripId === '') || ($userId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new TripUser($tripId, $userId);
      if (isset($data['role'])) {
         $object->setRole($data['role']);
      }
      if (isset($data['message'])) {
         $object->setMessage($data['message']);
      }
      if (isset($data['deleted'])) {
         $object->setDeleted($data['deleted']);
      }
      if (isset($data['profileImg'])) {
         $object->setProfileImg($data['profileImg']);
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
