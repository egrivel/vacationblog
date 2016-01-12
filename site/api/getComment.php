<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Comment.php');

function fillItem($item, $object) {
   $item['tripId'] = $object->getTripId();
   $item['commentId'] = $object->getCommentId();
   $item['created'] = $object->getCreated();
   $item['updated'] = $object->getUpdated();
   $item['userId'] = $object->getUserId();
   $item['referenceId'] = $object->getReferenceId();
   $item['commentText'] = $object->getCommentText();
   $item['deleted'] = $object->getDeleted();

   return $item;
}

$auth = new AuthB();
if (!$auth->canGetComment()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else {
   $tripId = '';
   if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }
   $commentId = '';
   if (isset($_GET['commentId'])) {
      $commentId = $_GET['commentId'];
   }
   $referenceId = '';
   if (isset($_GET['referenceId'])) {
      $referenceId = $_GET['referenceId'];
   }

   if (($tripId === '') ||
       (($commentId === '') && $referenceId === '')) {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   } else if ($commentId !== '') {
      $object = new Comment($tripId, $commentId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response = fillItem($response, $object);
      }
   } else {
      // By reference
      $resultArray = Array();
      $resultArrayCount = 0;

      $response = successResponse();
      $array = Comment::findByReferenceId($tripId, $referenceId);
      for ($i = 0; $i < count($array); $i++) {
         $object = new Comment($tripId, $array[$i]);
         if ($object->getCreated() !== null) {
            $item = Array();
            $item = fillItem($item, $object);
            $resultArray[$resultArrayCount++] = $item;
         }
      }

      $response['count'] = $resultArrayCount;
      $response['list'] = $resultArray;
   }
}
echo json_encode($response);
?>
