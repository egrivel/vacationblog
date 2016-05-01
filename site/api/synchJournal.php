<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Journal.php');

$auth = new AuthB();
if (!$auth->canSynchJournal()) {
   $response = errorResponse(RESPONSE_UNAUTHORIZED);
} else if (isGetMethod()) {
   if (isset($_GET['hash'])) {
      $hash = $_GET['hash'];
      if ($hash === '') {
         $response = errorResponse(RESPONSE_BAD_REQUEST, 'hash is blank');
      } else {
         $object = Journal::findByHash($hash);
         if ($object === null) {
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
            $response['hash'] = $object->getHash();
         }
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'hash not set');
   }
} else if (isPutMethod()) {
   $data = getPostData();
   if (isset($data['tripId']) && isset($data['journalId'])
       && ($data['tripId'] !== '') && ($data['journalId'] !== '')) {
      $tripId = $data['tripId'];
      $journalId = $data['journalId'];
      $object = new Journal($tripId, $journalId);
      if (isset($data['created'])) {
         $object->setCreated($data['created']);
      }
      if (isset($data['updated'])) {
         $object->setUpdated($data['updated']);
      }
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
      if (isset($data['hash'])) {
         $object->setHash($data['hash']);
      }
      if ($object->save()) {
         $response = successResponse();
      } else {
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
   } else {
      $response = errorResponse(RESPONSE_BAD_REQUEST, 'tripId or journalId not set');
   }
} else {
   $response = errorResponse(RESPONSE_BAD_REQUEST, 'not GET or PUT response');
}

echo json_encode($response);
?>
