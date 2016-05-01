<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . "/../database/Auth.php");
include_once(dirname(__FILE__) . "/../database/User.php");

class AuthB {
   private function getUser() {
      if (isset($_COOKIE['blogAuthId'])
         && ($_COOKIE['blogAuthId'] !== '')) {
         $authId = $_COOKIE['blogAuthId'];
         $auth = new Auth($authId);
         $userId = $auth->getUserId();
         if (isset($userId) && ($userId !== '')) {
            return new User($userId);
         }
      }
      return null;
   }
   public function canGetComment($tripId = '', $commentId = '') {
      // everyone can get comments
      return true;
   }
   public function canPutComment($tripId = '', $commentId = '') {
      $user = $this->getUser();
      if ($user) {
         $access = $user->getAccess();
         // all logged in users can put comments
         return (($access === LEVEL_VISITOR)
               || ($access === LEVEL_CONTRIB)
               || ($access === LEVEL_ADMIN));
      }
      return false;
   }
   public function canSynchComment($tripId = '', $commentId = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
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
   public function canGetUserBaseInfo($userId = '') {
      // everybody can get a user's base info
      return true;
   }
   public function canGetUserDetails($userId = '') {
      // only user themselves or admin can get details
      $user = $this->getUser();
      if ($user) {
         $access = $user->getAccess();
         if (($access === LEVEL_VISITOR)
            || ($access === LEVEL_CONTRIB)) {
            return ($userId === $user->getUserId());
         }
         return ($access === LEVEL_ADMIN);
      }
      return false;
   }
   public function canPutUser($userId = '') {
      $user = $this->getUser();
      if ($user) {
         $access = $user->getAccess();
         if (($access === LEVEL_VISITOR)
            || ($access === LEVEL_CONTRIB)) {
            // Regular users can only update their own info
            return ($userId === $user->getUserId());
         }
         // administrators can update all users
         return ($access === LEVEL_ADMIN);
      }
      return false;
   }
   public function canSynchUser($userId = '') {
      return true;
   }
}
?>
