<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Comment.php');

$auth = new AuthB();
if (!$auth->canSynchComment()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_INVALID_PARAM);
      } else {
         $object = Comment::findByHash($hash);
         if ($object === null) {
            $response = errorResponse(RESPONSE_NOT_FOUND);
         } else {
            $response = successResponse();
            $response['tripId'] = $object->getTripId();
            $response['commentId'] = $object->getCommentId();
            $response['created'] = $object->getCreated();
            $response['updated'] = $object->getUpdated();
            $response['userId'] = $object->getUserId();
            $response['referenceId'] = $object->getReferenceId();
            $response['commentText'] = $object->getCommentText();
            $response['deleted'] = $object->getDeleted();
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   }
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   if (isset($data['tripId']) && isset($data['commentId'])
       && ($data['tripId'] !== '') && ($data['commentId'] !== '')) {
      $tripId = $data['tripId'];
      $commentId = $data['commentId'];
      $object = new Comment($tripId, $commentId);
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
      if (isset($data['userId'])) {
         $object->setUserId($data['userId']);
      }
      if (isset($data['referenceId'])) {
         $object->setReferenceId($data['referenceId']);
      }
      if (isset($data['commentText'])) {
         $object->setCommentText($data['commentText']);
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
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   }
} else {
   $response = errorResponse(RESPONSE_INVALID_PARAM);
}

echo json_encode($response);
?>
