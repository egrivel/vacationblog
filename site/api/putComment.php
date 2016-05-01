<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Comment.php');

$auth = new AuthB();
if (!$auth->canPutComment()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $commentId = '';
   if (isset($data['commentId'])) {
      $commentId = $data['commentId'];
   }
   if (($tripId === '') || ($commentId === '')) {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   } else {
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
 }
echo json_encode($response);
?>
