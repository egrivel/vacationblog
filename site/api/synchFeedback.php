<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Feedback.php');

$auth = new AuthB();
if (!$auth->canSynchFeedback()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST);
      } else {
         $object = Feedback::findByHash($hash);
         if ($object === null) {
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
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else if (isPutMethod()) {
   $data = getPostData();
   if (isset($data['tripId']) && ($data['tripId'] !== '')
       && isset($data['referenceId']) && ($data['referenceId'] !== '')
       && isset($data['userId']) && ($data['userId'] !== '')) {
      $tripId = $data['tripId'];
      $referenceId = $data['referenceId'];
      $userId = $data['userId'];
      $object = new Feedback($tripId, $referenceId, $userId);
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
      if (isset($data['type'])) {
         $object->setType($data['type']);
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
         // @codeCoverageIgnoreStart
         // cannot unit test database errors
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
         // @codeCoverageIgnoreEnd
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else {
   $response = errorResponse(RESPONSE_BAD_REQUEST);
}

echo json_encode($response);
?>
