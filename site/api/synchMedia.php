<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Media.php');

$auth = new AuthB();
if (!$auth->canSynchMedia()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST);
      } else {
         $object = Media::findByHash($hash);
         if ($object === null) {
            $response = errorResponse(RESPONSE_NOT_FOUND);
         } else {
            $response = successResponse();
            $response['tripId'] = $object->getTripId();
            $response['mediaId'] = $object->getMediaId();
            $response['created'] = $object->getCreated();
            $response['updated'] = $object->getUpdated();
            $response['type'] = $object->getType();
            $response['caption'] = $object->getCaption();
            $response['timestamp'] = $object->getTimestamp();
            $response['location'] = $object->getLocation();
            $response['width'] = $object->getWidth();
            $response['height'] = $object->getHeight();
            $response['deleted'] = $object->getDeleted();
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   if (isset($data['tripId']) && isset($data['mediaId'])
       && ($data['tripId'] !== '') && ($data['mediaId'] !== '')) {
      $tripId = $data['tripId'];
      $mediaId = $data['mediaId'];
      $object = new Media($tripId, $mediaId);
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
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
      if (isset($data['hash'])) {
         $object->setHash($data['hash']);
      }
      if ($object->save()) {
         $response = successResponse();
      } else {
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else {
   $response = errorResponse(RESPONSE_BAD_REQUEST);
}

echo json_encode($response);
?>
