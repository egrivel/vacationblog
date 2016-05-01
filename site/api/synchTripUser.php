<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/TripUser.php');

$auth = new AuthB();
if (!$auth->canSynchTripUser()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST);
      } else {
         $object = TripUser::findByHash($hash);
         if ($object === null) {
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
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   if (isset($data['tripId']) && isset($data['userId'])
       && ($data['tripId'] !== '') && ($data['userId'] !== '')) {
      $tripId = $data['tripId'];
      $userId = $data['userId'];
      $object = new TripUser($tripId, $userId);
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
      if (isset($data['role'])) {
         $object->setRole($data['role']);
      }
      if (isset($data['message'])) {
         $object->setMessage($data['message']);
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
