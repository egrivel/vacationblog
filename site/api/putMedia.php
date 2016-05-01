<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Media.php');

$auth = new AuthB();
if (!$auth->canGetMedia()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $mediaId = '';
   if (isset($data['mediaId'])) {
      $mediaId = $data['mediaId'];
   }
   if (($tripId === '') || ($mediaId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new Media($tripId, $mediaId);
      if (isset($data['type'])) {
         $object->setType($data['type']);
      }
      if (isset($data['caption'])) {
         $object->setCaption($data['caption']);
      }
      if (isset($data['timestamp'])) {
         $object->setTimestamp($data['timestamp']);
      }
      if (isset($data['location'])) {
         $object->setLocation($data['location']);
      }
      if (isset($data['width'])) {
         $object->setWidth($data['width']);
      }
      if (isset($data['height'])) {
         $object->setHeight($data['height']);
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
