<?php
/**
 * call to log into the system
 */

include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/Auth.php');
include_once(dirname(__FILE__) . '/../database/User.php');

if (isPutMethod()) {
   $data = getPostData();
   $userId = '';
   if (isset($data['userId'])) {
      $userId = $data['userId'];
   }
   $password = '';
   if (isset($data['password'])) {
      $password = $data['password'];
   }
   if (($userId === '') || ($password === '')) {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else {
      $user = new User($userId);
      if ($user->getCreated() === null) {
        $response = errorResponse(RESPONSE_NOT_FOUND);
      } else {
        if ($user->checkPassword($password)) {
          // password matches, need to allow for hash update (if hash
          // algorithm changed, the new hash can only be stored in the
          // database when we have the actual password, and only at login
          // time do we have the actual password)
          $user->updatePasswordHash($password);
          $authId = Auth::generateAuthId();
          $auth = new Auth($authId);
          $auth->setUserId($userId);
          $auth->save();
          $response = successResponse();
          $response['authId'] = $authId;
        } else {
          $response = errorResponse(RESPONSE_UNAUTHORIZED);
        }
      }
   }
}

echo json_encode($response);
?>
