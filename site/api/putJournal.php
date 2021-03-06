<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Journal.php');
include_once(dirname(__FILE__) . '/functions.php');

$auth = new AuthB();
if (!$auth->canGetJournal()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isPutMethod()) {
   $data = getPostData();
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $journalId = '';
   if (isset($data['journalId'])) {
      $journalId = $data['journalId'];
   }
   if ($tripId === '') {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      if ($journalId === '') {
         // Create a new journal entry
         $journalId = Journal::generateJournalId();
         $object = new Journal($tripId, $journalId);
         $object->setUserId($auth->getUserId());
         $object->setDeleted('N');
      } else {
         $object = new Journal($tripId, $journalId);
         if (isset($data['userId'])) {
            $object->setUserId($data['userId']);
         }
         if (isset($data['deleted'])) {
            $object->setDeleted($data['deleted']);
         }
      }
      if (isset($data['journalDate'])) {
         $object->setJournalDate($data['journalDate']);
      }
      if (isset($data['journalTitle'])) {
         $object->setJournalTitle($data['journalTitle']);
      }
      if (isset($data['journalText'])) {
         $object->setJournalText($data['journalText']);
         processJournalForMedia($tripId, $data['journalText']);
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
