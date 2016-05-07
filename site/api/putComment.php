<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Comment.php');

$auth = new AuthB();
if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $commentId = '';
   if (isset($data['commentId'])) {
      $commentId = $data['commentId'];
   }
   if (($tripId === '') || ($commentId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'Need tripId and commentId');
   } else if (!$auth->canPutComment($tripId, $commentId)) {
      $response = errorResponse(RESPONSE_UNAUTHORIZED);
   } else  {
      $object = new Comment($tripId, $commentId);
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
      if ($object->save()) {
         $response = successResponse();
      } else {
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
   }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'Must use PUT method');
}
echo json_encode($response);
?>
