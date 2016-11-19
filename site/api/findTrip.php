<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');

/**
 * Get a list of all the trips. The trips are returned in a sorted manner,
 * with the most recent trip first.
 */
$auth = new AuthB();
if (!$auth->canGetTrip()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else {
   if ($resultSet = Trip::listTrips()) {
      $response = successResponse();
      $response['resultSet'] = $resultSet;
   } else {
      // @codeCoverageIgnoreStart
      // cannot unit test database errors
      $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      // @codeCoverageIgnoreEnd
   }
}
echo json_encode($response);
?>
