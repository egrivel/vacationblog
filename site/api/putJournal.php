<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Trip.php');
include_once(dirname(__FILE__) . '/../database/Journal.php');

$auth = new AuthB();
if (!$auth->canGetJournal()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   $tripId = '';
   if (isset($data['tripId'])) {
      $tripId = $data['tripId'];
   }
   $journalId = '';
   if (isset($data['journalId'])) {
      $journalId = $data['journalId'];
   }
   if (($tripId === '') || ($journalId === '')) {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
   } else {
      $object = new Journal($tripId, $journalId);
      if (isset($data['userId'])) {
         $object->setUserId($data['userId']);
      }
      if (isset($data['journalDate'])) {
         $object->setJournalDate($data['journalDate']);
      }
      if (isset($data['journalTitle'])) {
         $object->setJournalTitle($data['journalTitle']);
      }
      if (isset($data['journalText'])) {
         $object->setJournalText($data['journalText']);
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
