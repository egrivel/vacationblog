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

   if (($tripId === '') || ($journalId === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $object = new Journal($tripId, $journalId);
      if ($object->getCreated() === null) {
         $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
         $response = successResponse();
         $response['tripId'] = $object->getTripId();
         $response['journalId'] = $object->getJournalId();
         $response['created'] = $object->getCreated();
         $response['updated'] = $object->getUpdated();
         $response['userId'] = $object->getUserId();
         $response['journalDate'] = $object->getJournalDate();
         $response['journalTitle'] = $object->getJournalTitle();
         $response['journalText'] = $object->getJournalText();
         $response['deleted'] = $object->getDeleted();
         if ($temp = $object->getPreviousJournal()) {
            $response['prevId'] = $temp->getJournalId();
         }
         if ($temp = $object->getNextJournal()) {
            $response['nextId'] = $temp->getJournalId();
         }
      }
   }
}
echo json_encode($response);
?>
