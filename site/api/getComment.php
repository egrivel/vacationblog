<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Comment.php');
include_once(dirname(__FILE__) . '/functions.php');


$auth = new AuthB();
if (!$auth->canGetComment()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
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
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'Must give trip ID and either comment or reference ID');
   } else if ($commentId !== '') {
      $object = new Comment($tripId, $commentId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response = fillCommentItem($response, $object);
      }
   } else {
      // By reference
      $resultArray = Array();
      $resultArrayCount = 0;

      $response = successResponse();
      // Note: returns null if there are no comments
      $array = Comment::findByReferenceId($tripId, $referenceId);
      if ($array) {
         for ($i = 0; $i < count($array); $i++) {
            $object = new Comment($tripId, $array[$i]);
            if ($object->getCreated() !== null) {
               $item = Array();
               $item = fillCommentItem($item, $object);
               $resultArray[$resultArrayCount++] = $item;
            }
         }
      }

      $response['count'] = $resultArrayCount;
      $response['list'] = $resultArray;
   }
}
echo json_encode($response);
?>
