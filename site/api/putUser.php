<?php
include_once(dirname(__FILE__) . '/../common/common.php');
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');
include_once(dirname(__FILE__) . '/loginFunctions.php');

$auth = new AuthB();

if (isPutMethod()) {
   $data = getPostData();
   $userId = '';
   if (isset($data['userId'])) {
      $userId = $data['userId'];
   }
   if ($userId === '') {
      $response = errorResponse(RESPONSE_BAD_REQUEST);
   } else if (!$auth->canPutUser($userId)) {
      $response = errorResponse(RESPONSE_UNAUTHORIZED);
   } else {
      $object = new User($userId);
      $authUserId = $auth->getUserId();
      $sendEmailEmail = false;
      $sendPasswordEmail = false;
      if (isset($data['name'])) {
         $object->setName($data['name']);
      }
      if (isset($data['externalType'])) {
         $object->setExternalType($data['externalType']);
      }
      if (isset($data['externalId'])) {
         $object->setExternalId($data['externalId']);
      }
      if (isset($data['access'])) {
         $object->setAccess($data['access']);
      }
      if (isset($data['email'])) {
         if ($authUserId === $userid) {
            $sendEmailEmail = true;
            $object->setTempEmail($data['email']);
            $object->setTempEmailCode(random_string());
         } else {
            $object->setEmail($data['email']);
         }
      }
      if (isset($data['password'])) {
         if ($authUserId === $userid) {
            $sendPasswordEmail = true;
         }
         $object->setPassword($data['password']);
      }
      if (isset($data['notification'])) {
         $object->setNotification($data['notification']);
      }
      if (isset($data['tempCode'])) {
         $object->setTempCode($data['tempCode']);
      }
      if (isset($data['deleted'])) {
         $object->setDeleted($data['deleted']);
      }
      if ($object->save()) {
         $response = successResponse();
      } else {
         $response = errorResponse(RESPONSE_INTERNAL_ERROR);
      }
      if ($sendEmailEmail) {
         send_email_change_email($userId, $object->getEmail(), $data['email']);
      }
      if ($sendPasswordEmail) {
         send_password_change_email($userId, $object->getName(),
            $object->getEmail());
      }
   }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'Use Put method');
}

echo json_encode($response);
?>
