<?php
include_once(dirname(__FILE__) . "/../common/common.php");
include_once(dirname(__FILE__) . '/../business/AuthB.php');
include_once(dirname(__FILE__) . '/../database/User.php');

$auth = new AuthB();
if (!$auth->canGetUser()) {
   $response = errorResponse(RESPONSE_NOT_ALLOWED);
} else if (isPutMethod()) {
   $data = json_decode(file_get_contents('php://input'), true);
   $userId = '';
   if (isset($data['userId'])) {
      $userId = $data['userId'];
   }
   if ($userId === '') {
      $response = errorResponse(RESPONSE_INVALID_PARAM);
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
 }
echo json_encode($response);
?>
