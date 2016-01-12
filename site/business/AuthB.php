<?php
include_once(dirname(__FILE__) . "/../common/common.php");

class AuthB {
   public function canGetComment($tripId = '', $commentId = '') {
      return true;
   }
   public function canPutComment($tripId = '', $commentId = '') {
      return true;
   }
   public function canSynchComment($tripId = '', $commentId = '') {
      return true;
   }
   public function canGetFeedback($userId = '',
                                  $referenceId = '',
                                  $userId = '') {
      return true;
   }
   public function canPutFeedback($userId = '',
                                  $referenceId = '',
                                  $userId = '') {
      return true;
   }
   public function canSynchFeedback($userId = '',
                                    $referenceId = '',
                                    $userId = '') {
      return true;
   }
   public function canGetJournal($tripId = '', $journalId = '') {
      return true;
   }
   public function canPutJournal($tripId = '', $journalId = '') {
      return true;
   }
   public function canSynchJournal($tripId = '', $journalId = '') {
      return true;
   }
   public function canGetMedia($tripId = '', $mediaId = '') {
      return true;
   }
   public function canPutMedia($tripId = '', $mediaId = '') {
      return true;
   }
   public function canSynchMedia($tripId = '', $mediaId = '') {
      return true;
   }
   public function canGetTrip($tripId = '') {
      return true;
   }
   public function canPutTrip($tripId = '') {
      return true;
   }
   public function canSynchTrip($tripId = '') {
      return true;
   }
   public function canGetTripAttribute($tripId = '', $name = '') {
      return true;
   }
   public function canPutTripAttribute($tripId = '', $name = '') {
      return true;
   }
   public function canSynchTripAttribute($tripId = '', $name = '') {
      return true;
   }
   public function canGetTripUser($tripId = '', $userId = '') {
      return true;
   }
   public function canPutTripUser($tripId = '', $userId = '') {
      return true;
   }
   public function canSynchTripUser($tripId = '', $userId = '') {
      return true;
   }
   public function canGetUser($userId = '') {
      return true;
   }
   public function canPutUser($userId = '') {
      return true;
   }
   public function canSynchUser($userId = '') {
      return true;
   }
}
?>
