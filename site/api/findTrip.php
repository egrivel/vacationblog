<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');

$auth = new AuthB();
if (!$auth->canGetTrip()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else {
   if ($resultSet = Trip::listTrips()) {
      $response = successResponse();
      $response['resultSet'] = $resultSet;
   } else {
      $response = errorResponse(RESPONSE_NOT_ALLOWED);
   }
}
echo json_encode($response);
?>
