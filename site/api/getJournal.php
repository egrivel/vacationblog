<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Journal.php');

$auth = new AuthB();
if (!$auth->canGetJournal()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else {
   $tripId = '';
   if (isset($_GET['tripId'])) {
      $tripId = $_GET['tripId'];
   }
   $journalId = '';
   if (isset($_GET['journalId'])) {
      $journalId = $_GET['journalId'];
   }

   if ($tripId === '') {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else if ($journalId === '') {
      // Get all journal entries for a trip
      $resultSet = Journal::listTripJournalDates($tripId);
      $response = successResponse();
      $response['resultSet'] = $resultSet;
   } else {
      $object = new Journal($tripId, $journalId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $journalDate = $object->getJournalDate();
         $response['tripId'] = $object->getTripId();
         $response['journalId'] = $object->getJournalId();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['userId'] = $object->getUserId();
         $response['journalDate'] = $journalDate;
         $response['journalTitle'] = $object->getJournalTitle();
         $response['journalText'] = $object->getJournalText();
         $response['deleted'] = $object->getDeleted();
         $journalId = $object->getPreviousJournalId();
         if ($journalId) {
            $response['prevId'] = $journalId;
         }
         $journalId = $object->getNextJournalId();
         if ($journalId) {
            $response['nextId'] = $journalId;
         }

         $journalDate = str_replace('-', '', $journalDate);
         if (file_exists("../maps/$journalDate.html")) {
            $response['map'] = "./maps/$journalDate.html";
         }
      }
   }
}
echo json_encode($response);
?>
