<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Journal.php');

$auth = new AuthB();
if (!$auth->canGetTrip()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else {
   $tripId = '';
   if (isset($_GET['current'])) {
      $tripId = Trip::findCurrentTrip();
      if (!$tripId) {
         $tripId = '';
      }
   } else if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }

   if ($tripId === '') {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new Trip($tripId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['tripId'] = $object->getTripId();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['name'] = $object->getName();
         $response['description'] = $object->getDescription();
         $response['bannerImg'] = $object->getBannerImg();
         $response['startDate'] = $object->getStartDate();
         $response['endDate'] = $object->getEndDate();
         $response['active'] = $object->getActive();
         $response['deleted'] = $object->getDeleted();
         // Do NOT return the hash field on the GET service.
         $journalId = Journal::getFirstJournalId($object->getTripId());
         if ($journalId) {
            $response['firstJournalId'] = $journalId;
         }
         $journalId = Journal::getLastJournalId($object->getTripId());
         if ($journalId) {
            $response['lastJournalId'] = $journalId;
         }
      }
   }
}
echo json_encode($response);
?>
