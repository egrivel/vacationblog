<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');

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
         $object->setEmail($data['email']);
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
   }
} else {
   $response = errorResponse(RESPONSE_METHOD_NOT_ALLOWED, 'Use Put method');
}
echo json_encode($response);
?>
