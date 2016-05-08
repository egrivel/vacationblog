<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . "/../database/Auth.php");
include_once(dirname(__FILE__) . "/../database/User.php");
include_once(dirname(__FILE__) . "/../database/Comment.php");

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

   // everyone by synch user can do this
   public function canGetComment($tripId = '', $commentId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }

   public function canPutComment($tripId = '', $commentId = '') {
      $user = $this->getUser();
      if ($user) {
         $access = $user->getAccess();
         if ($access === LEVEL_ADMIN) {
            // administrator can put all comments
            return true;
         }
         if (($access === LEVEL_VISITOR)
            || ($access === LEVEL_CONTRIB)) {
            // visitor and contributor can put their own comments, or
            // new comments (comments that don't have any user ID)
            if ($tripId && $commentId) {
               $object = new Comment($tripId, $commentId);
               $objectId = $object->getUserId();
               return (($objectId === '') || ($objectId === $user->getUserId()));
            }
         }
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

   // everyone by synch user can do this
   public function canGetFeedback($tripId = '',
                                  $referenceId = '',
                                  $userId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }
   public function canPutFeedback($tripId = '',
                                  $referenceId = '') {
      $user = $this->getUser();
      if ($user) {
         $access = $user->getAccess();
         if (($access === LEVEL_ADMIN)
            || ($access === LEVEL_VISITOR)
            || ($access === LEVEL_CONTRIB)) {
            // all logged in users can put feedback, since they will be
            // updating their own feedback when they do put.
            return true;
         }
      }
      return false;
   }
   public function canSynchFeedback($userId = '',
                                    $referenceId = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   // everyone by synch user can do this
   public function canGetJournal($tripId = '', $journalId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }
   public function canPutJournal($tripId = '', $journalId = '') {
      return true;
   }
   public function canSynchJournal($tripId = '', $journalId = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   // everyone by synch user can do this
   public function canGetMedia($tripId = '', $mediaId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }
   public function canPutMedia($tripId = '', $mediaId = '') {
      return true;
   }
   public function canSynchMedia($tripId = '', $mediaId = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   // everyone by synch user can do this
   public function canGetTrip($tripId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }
   public function canPutTrip($tripId = '') {
      return true;
   }
   public function canSynchTrip($tripId = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   // everyone by synch user can do this
   public function canGetTripAttribute($tripId = '', $name = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }
   public function canPutTripAttribute($tripId = '', $name = '') {
      return true;
   }
   public function canSynchTripAttribute($tripId = '', $name = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   // everyone by synch user can do this
   public function canGetTripUser($tripId = '', $userId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
      return true;
   }
   public function canPutTripUser($tripId = '', $userId = '') {
      return true;
   }
   public function canSynchTripUser($tripId = '', $userId = '') {
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   // everyone by synch user can do this
   public function canGetUserBaseInfo($userId = '') {
      $user = $this->getUser();
      if ($user
         && ($user->getAccess() === LEVEL_SYNCH)) {
         return false;
      }
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
      $user = $this->getUser();
      if ($user) {
         // only synch user can synch
         $access = $user->getAccess();
         return ($access === LEVEL_SYNCH);
      }
      return false;
   }

   public function getUserId() {
      $user = $this->getUser();
      if ($user) {
         return $user->getUserId();
      }
      return null;
   }
}
?>
