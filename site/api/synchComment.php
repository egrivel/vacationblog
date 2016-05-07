<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Comment.php');

$auth = new AuthB();
if (!$auth->canSynchComment()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST, 'need hash');
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
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'need hash');
   }
} else if (isPutMethod()) {
   $data = getPostData();
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
         // @codeCoverageIgnoreStart
         // cannot unit test database errors
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
         // @codeCoverageIgnoreEnd
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'must be get or put');
}

echo json_encode($response);
?>
