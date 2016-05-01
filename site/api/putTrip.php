<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');

$auth = new AuthB();
if (!$auth->canPutTrip()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   if ($tripId === '') {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new Trip($tripId);
      if (isset($data['name'])) {
         $object->setName($data['name']);
      }
      if (isset($data['description'])) {
         $object->setDescription($data['description']);
      }
      if (isset($data['bannerImg'])) {
         $object->setBannerImg($data['bannerImg']);
      }
      if (isset($data['startDate'])) {
         $object->setStartDate($data['startDate']);
      }
      if (isset($data['endDate'])) {
         $object->setEndDate($data['endDate']);
      }
      if (isset($data['active'])) {
         $object->setActive($data['active']);
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
} else {
   $response = errorResponse(RESPONSE_BAD_REQUEST);
}
echo json_encode($response);
?>
