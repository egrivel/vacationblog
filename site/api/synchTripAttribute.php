<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/TripAttribute.php');

$auth = new AuthB();
if (!$auth->canSynchTripAttribute()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST);
      } else {
         $object = TripAttribute::findByHash($hash);
         if ($object === null) {
            $response = errorResponse(RESPONSE_NOT_FOUND);
         } else {
            $response = successResponse();
            $response['tripId'] = $object->getTripId();
            $response['name'] = $object->getName();
            $response['created'] = $object->getCreated();
            $response['updated'] = $object->getUpdated();
            $response['value'] = $object->getValue();
            $response['deleted'] = $object->getDeleted();
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   if (isset($data['tripId']) && isset($data['name'])
       && ($data['tripId'] !== '') && ($data['name'] !== '')) {
      $tripId = $data['tripId'];
      $name = $data['name'];
      $object = new TripAttribute($tripId, $name);
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
      if (isset($data['value'])) {
         $object->setValue($data['value']);
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
