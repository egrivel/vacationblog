<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Media.php');
include_once(dirname(__FILE__) . '/functions.php');

$auth = new AuthB();
if (!$auth->canGetMedia()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else {
   $tripId = '';
   if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }
   $mediaId = '';
   if (isset($_GET['mediaId'])) {
      $mediaId = $_GET['mediaId'];
   }
   $list = '';
   if (isset($_GET['list'])) {
      $list = $_GET['list'];
   }

   if (($tripId === '') || (($mediaId === '') && ($list === ''))) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      if ($mediaId !== '') {
         $object = new Media($tripId, $mediaId);
         if ($object->getCreated() === null) {
            $response = errorResponse(RESPONSE_NOT_FOUND);
         } else {
            $response = successResponse();
            $response = fillMediaItem($response, $object);
         }
      } else {
         $array = split(',', $list);
         $resultArray = Array();
         $resultArrayCount = 0;
         for ($i = 0; $i < count($array); $i++) {
            $object = new Media($tripId, $array[$i]);
            if ($object->getCreated() !== null) {
               $item = Array();
               $item = fillMediaItem($item, $object);
               $resultArray[$resultArrayCount++] = $item;
            }
         }
         $response = successResponse();
         $response['count'] = $resultArrayCount;
         $response['list'] = $resultArray;
      }
   }
}
echo json_encode($response);
?>
